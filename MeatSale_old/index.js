const { Contract } = require("fabric-contract-api") 
const { MeatSale } = require("./domain/contract/MeatSale.js")
const { deserialize, serialize } = require("./serializer.js")
const { Events } = require("symboleo-js-core")
const { InternalEvent, InternalEventSource, InternalEventType } = require("symboleo-js-core")
const { getEventMap, EventListeners } = require("./events.js")
const { ClientIdentity, ChaincodeStub }= require('fabric-shim');


class HFContract extends Contract {

 
  constructor() {
    super('MeatSale'); 
    //method 2
     this.userList = [];
  }

  initialize(contract) {
    Events.init(getEventMap(contract), EventListeners)
  }
/*
  async addUser(ctx, args){
     const inputs = JSON.parse(args);
     const role = inputs.seller
     const username = inputs.seller.name;
     const index = username+'_user';
     await ctx.stub.putState(index, Buffer.from(JSON.stringify({role: role, username: username})))
     return {successful: true, index: index, username: username}
  }
  */
 /*
  async addUser(ctx, args) {
    const inputs = JSON.parse(args);
    const users = inputs.users;

    if (!Array.isArray(users)) {
        throw new Error('Invalid input format: "users" field must be an array.');
    }

    const results = [];

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const role = user.role;
        const username = user.name;
        const index = `${username}_user`;
        console.log(username);

        await ctx.stub.putState(index, Buffer.from(JSON.stringify({ role, username })));

        results.push({ successful: true, index, username });
    }

    return results;
}
*/
  /*
  async getUser(ctx, index){
    console.log('getUser: indexId: ', index)
      const userBuffer= await ctx.stub.getState(index)
      if (!userBuffer || userBuffer.length === 0) {
        throw new Error(`The user ${id} does not exist`);
      }
      return userBuffer.toString();
  }*/


  async getUsers(ctx, index){
    const userBuffer= await ctx.stub.getState(index)
    if (!userBuffer || userBuffer.length === 0) {
      throw new Error(`init contract index ${id} does not exist`);
    }

    return JSON.parse(userBuffer.toString()).userList;
  }


  
  async init(ctx, args) {
  	const inputs = JSON.parse(args);
    const contractInstance = new MeatSale (inputs.buyer,inputs.seller,inputs.qnt,inputs.qlt,inputs.amt,inputs.curr,inputs.payDueDate,inputs.delAdd,inputs.effDate,inputs.delDueDateDays,inputs.interestRate, inputs.users)
    this.initialize(contractInstance)
    if (contractInstance.activated()) {
      // call trigger transitions for legal positions
      contractInstance.obligations.delivery.trigerredUnconditional()
      contractInstance.obligations.payment.trigerredUnconditional()
      
      await ctx.stub.putState(contractInstance.id, Buffer.from(serialize(contractInstance)))
  
      return {successful: true, contractId: contractInstance.id}
    } else {
      return {successful: false}
    }
  }


  async trigger_delivered(ctx, args) {
  	const inputs = JSON.parse(args);
  	const contractId = inputs.contractId;
  	const event = inputs.event;
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
    if (contract.isInEffect()) {
      contract.delivered.happen(event)
      Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.delivered))
      await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
      return {successful: true}
    } else {
      return {successful: false}
    }
  }
  
  async trigger_paidLate(ctx, args) {
    const cid = new ClientIdentity(ctx.stub);
    try{
      const userId = cid.getID();
      const enrollmentId = userId.match(/CN=([^:]+)::/)[1]; // like user1, user2, seller1, seller2, buyer1
      // role base access or certificate base access
      if(userId === `x509::/OU=client/OU=org1/OU=department1/CN=${enrollmentId}::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com`){
          console.log(`${enrollmentId} allow to access the chaincode function`)
      }else{
        return {successful: false, message: `${enrollmentId} does not have access to trigger_paidLate function`}
      }
     
      if(cid.assertAttributeValue('HF.role', 'party1_seller')){
          console.log(`${enrollmentId} have party1_seller hf.role`)
      }else{
        return {successful: false,message: `${enrollmentId} does not have party1_buyer hf.role`}
      }
    }catch(err){
        console.log('access control error: ', err)
    }
  	const inputs = JSON.parse(args);
  	const contractId = inputs.contractId;
  	const event = inputs.event;
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
    if (contract.isInEffect()) {
      contract.paidLate.happen(event)
      Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.paidLate))
      await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
      const asset = {
        contractId: contractId,
        event: event,
        message: 'The late payment has been Paid successfully'
      };
      const assetBuffer = Buffer.from(JSON.stringify(asset));
      ///it will be triggred by notificatipn function
      ctx.stub.setEvent('Notified: triggerPaidLate', assetBuffer);
      return {successful: true}
    } else {
      return {successful: false}
    }
  }
  
  async trigger_paid(ctx, args) {
    const cid = new ClientIdentity(ctx.stub);
    try{
      const userId = cid.getID();
      //const enrollmentId = userId.match(/CN=([^:]+)::/)[1];
      //const enrollmentId = userId.match(/CN=([^:/]+)(?=::\/)/)[1];

      const match = userId.match(/CN=([^:/]+)(?=::\/)/);
      const enrollmentId = match ? match[1] : null;

        // two lines to compare
        //console.log("Actual userId:", userId);
        //console.log("Expected userId:", `x509::/OU=client/OU=org1/OU=department1/CN=${enrollmentId}::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com`);

      //if (userId.includes(`/CN=${enrollmentId}`))
      //if(userId === `x509::/OU=client/OU=org1/OU=department1/CN=${enrollmentId}::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com`)
    
      if (userId === `x509::/OU=client/OU=org1/OU=department1/CN=${enrollmentId}::/C=US/ST=North Carolina/O=Hyperledger/OU=Fabric/CN=fabric-ca-server`) {
          console.log(`${enrollmentId} allow to access the chaincode function`)
      }else{
        return {successful: false, message: `${enrollmentId} does not have access to trigger_paid function`}
      }

      if(cid.assertAttributeValue('HF.role', 'party1_buyer')){
          console.log(`${enrollmentId} have party1_buyer hf.role`)
      }else{
        return {successful: false,message: `${enrollmentId} does not have party1_buyer hf.role`}
      }
    }catch(err){
        console.log('access control error: ', err)
    }
  	const inputs = JSON.parse(args);
  	const contractId = inputs.contractId;
  	const event = inputs.event;
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
    if (contract.isInEffect()) {
      contract.paid.happen(event)
      Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.paid))
      ctx.stub.setEvent('Notified: triggerPaid', Buffer.from(serialize(contract)));
      await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
      return {successful: true}
    } else {
      return {successful: false}
    }
  }
  
  async trigger_disclosed(ctx, args) {
  	const inputs = JSON.parse(args);
  	const contractId = inputs.contractId;
  	const event = inputs.event;
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
    if (contract.isInEffect()) {
      contract.disclosed.happen(event)
      Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.disclosed))
      await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
      return {successful: true}
    } else {
      return {successful: false}
    }
  }
  
  async p_suspendDelivery_suspended_o_delivery(ctx, contractId) {
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
  
    if (contract.isInEffect() && contract.powers.suspendDelivery != null && contract.powers.suspendDelivery.isInEffect()) {
      const obligation = contract.obligations.delivery
      if (obligation != null && obligation.suspended() && contract.powers.suspendDelivery.exerted()) {
        await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
        return {successful: true}
      } else {
        return {successful: false}
      }
    } else {
      return {successful: false}
    }
  }
  
  async p_resumeDelivery_resumed_o_delivery(ctx, contractId) {
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
  
    if (contract.isInEffect() && contract.powers.resumeDelivery != null && contract.powers.resumeDelivery.isInEffect()) {
      const obligation = contract.obligations.delivery
      if (obligation != null && obligation.resumed() && contract.powers.resumeDelivery.exerted()) {
        await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
        return {successful: true}
      } else {
        return {successful: false}
      }
    } else {
      return {successful: false}
    }
  }
  
  async p_terminateContract_terminated_contract(ctx, contractId) {
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
  
    if (contract.isInEffect() && contract.powers.terminateContract != null && contract.powers.terminateContract.isInEffect()) {
      for (let index in contract.obligations) {
        const obligation = contract.obligations[index]
        obligation.terminated({emitEvent: false})
      }
      for (let index in contract.survivingObligations) {
        const obligation = contract.survivingObligations[index]
        obligation.terminated()
      }
      for (let index in contract.powers) {
        const power = contract.powers[index]
        if (index === 'terminateContract') {
          continue;
        }
        power.terminated()
      }        
      if (contract.terminated() && contract.powers.terminateContract.exerted()) {
        await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
        return {successful: true}
      } else {
        return {successful: false}
      }
    } else {
      return {successful: false}
    }
  }
  
  async violateObligation_latePayment(ctx, contractId) {
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
  
    if (contract.isInEffect()) {
      if (contract.obligations.latePayment != null && contract.obligations.latePayment.violated()) {      
        await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
        return {successful: true}
      } else {
        return {successful: false}
      }
    } else {
      return {successful: false}
    }
  }
  
  async violateObligation_delivery(ctx, contractId) {
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
  
    if (contract.isInEffect()) {
      if (contract.obligations.delivery != null && contract.obligations.delivery.violated()) {      
        await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
        return {successful: true}
      } else {
        return {successful: false}
      }
    } else {
      return {successful: false}
    }
  }
  
  async violateObligation_payment(ctx, contractId) {
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
  
    if (contract.isInEffect()) {
      if (contract.obligations.payment != null && contract.obligations.payment.violated()) {  
        ctx.stub.setEvent('Notified: violateObligation_payment', Buffer.from(serialize(contract)));  
        await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
        return {successful: true}
      } else {
        return {successful: false}
      }
    } else {
      return {successful: false}
    }
  }
  
  async expirePower_suspendDelivery(ctx, contractId) {
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
  
    if (contract.isInEffect()) {
      if (contract.powers.suspendDelivery != null && contract.powers.suspendDelivery.expired()) {      
        await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
        return {successful: true}
      } else {
        return {successful: false}
      }
    } else {
      return {successful: false}
    }
  }
  
  async expirePower_resumeDelivery(ctx, contractId) {
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
  
    if (contract.isInEffect()) {
      if (contract.powers.resumeDelivery != null && contract.powers.resumeDelivery.expired()) {      
        await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
        return {successful: true}
      } else {
        return {successful: false}
      }
    } else {
      return {successful: false}
    }
  }
  
  async expirePower_terminateContract(ctx, contractId) {
    const contractState = await ctx.stub.getState(contractId)
    if (contractState == null) {
      return {successful: false}
    }
    const contract = deserialize(contractState.toString())
    this.initialize(contract)
  
    if (contract.isInEffect()) {
      if (contract.powers.terminateContract != null && contract.powers.terminateContract.expired()) {      
        await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
        return {successful: true}
      } else {
        return {successful: false}
      }
    } else {
      return {successful: false}
    }
  }
  
  
  async getState(ctx, contractId) {
  	const contractState = await ctx.stub.getState(contractId)
  	if (contractState == null) {
  	  return {successful: false}
  	}
  	const contract = deserialize(contractState.toString())
  	this.initialize(contract)
  	let output = `Contract state: ${contract.state}-${contract.activeState}\r\n`
  	output += 'Obligations:\r\n'
  	for (const obligationKey of Object.keys(contract.obligations)) {
      output += `  ${obligationKey}: ${contract.obligations[obligationKey].state}-${contract.obligations[obligationKey].activeState}\r\n`
    }
    output += 'Powers:\r\n'
    for (const powerKey of Object.keys(contract.powers)) {
      output += `  ${powerKey}: ${contract.powers[powerKey].state}-${contract.powers[powerKey].activeState}\r\n`
    }
    output += 'Surviving Obligations:\r\n'
    for (const obligationKey of Object.keys(contract.survivingObligations)) {
      output += `  ${obligationKey}: ${contract.survivingObligations[obligationKey].state}-${contract.survivingObligations[obligationKey].activeState}\r\n`
    }
    output += 'Events:\r\n'
    if (contract.delivered._triggered) {
      output += `  Event "delivered" happened at ${contract.delivered._timestamp}\r\n`
    } else {
      output += `  Event "delivered" has not happened\r\n`
    }
    if (contract.paidLate._triggered) {
      output += `  Event "paidLate" happened at ${contract.paidLate._timestamp}\r\n`
    } else {
      output += `  Event "paidLate" has not happened\r\n`
    }
    if (contract.paid._triggered) {
      output += `  Event "paid" happened at ${contract.paid._timestamp}\r\n`
    } else {
      output += `  Event "paid" has not happened\r\n`
    }
    if (contract.disclosed._triggered) {
      output += `  Event "disclosed" happened at ${contract.disclosed._timestamp}\r\n`
    } else {
      output += `  Event "disclosed" has not happened\r\n`
    }
    
    return output
  }
}

module.exports.contracts = [HFContract];