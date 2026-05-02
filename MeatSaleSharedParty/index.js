     const { Contract } = require("fabric-contract-api")
     const { MeatSaleSharedParty } = require("./domain/contract/MeatSaleSharedParty.js")
     const { deserialize, serialize } = require("./serializer.js")
     const { Events } = require("symboleoac-js-core")
     const { InternalEvent, InternalEventSource, InternalEventType } = require("symboleoac-js-core")
     const { getEventMap, EventListeners } = require("./events.js")
     const { Rule } = require("symboleoac-js-core")
     const { error } = require("fabric-shim")
     const { ClientIdentity, ChaincodeStub }= require('fabric-shim');
     const crypto = require('crypto');
     class HFContract extends Contract {
       
       constructor() {
         super('MeatSaleSharedParty');
         
       }
     
       initialize(contract) {
         Events.init(getEventMap(contract), EventListeners)
       }
     
       async init(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
         const contractInstance = new MeatSaleSharedParty (inputs.buyerP, inputs.sellerP, inputs.transportCoP, inputs.assessorP, inputs.regulatorP, inputs.storageP, inputs.shipperP, inputs.adminP, inputs.barcodeP, inputs.qnt, inputs.qlt, inputs.amt, inputs.curr, inputs.payDueDate, inputs.delAdd, inputs.effDate, inputs.delDueDateDays, inputs.interestRate)
         this.initialize(contractInstance)
         if (contractInstance.activated()) {
           // call trigger transitions for legal positions
           contractInstance.obligations.delivery.trigerredUnconditional()
           contractInstance.obligations.payment.trigerredConditional()
       // First security layer
                 	try{           	
                 	       roleObj = contractInstance.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
                 	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contractInstance)
                 	
                 	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) not exist in our conttract
                 	              throw new Error('Unauthorized: Unknown access'); 
                 	        }
                 	
                 	    }catch(err){
                 	        console.log('access control error: ', err)
                 	        return { successful: false, message: err.message }
                 	    }// end of first layer
           await ctx.stub.putState(contractInstance.id, Buffer.from(serialize(contractInstance)))
       
           return {successful: true, contractId: contractInstance.id}
         } else {
           return {successful: false}
         }
       }
     
       async trigger_delivered(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
       	const contractId = inputs.contractId;
       	const event = inputs.event;
         	const contractState = await ctx.stub.getState(contractId)
         	if (contractState == null) {
       	   		 return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         //notification
         const oldMessagesList = []
         oldMessagesList.push(contract.notified.message.slice())
         this.initialize(contract)
         if (contract.isInEffect()  ){
         	// First security layer
         	try{           	
         	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	
         	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	              throw new Error('Unauthorized: Unknown access'); 
         	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	        // wrong certificate
         	        }
         	
         	    }catch(err){
         	        console.log('access control error: ', err)
         	        return { successful: false, message: err.message }
         	    }// end of first layer
         	    //seond layer
         	    let controllers = contract.delivered._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.delivered,roleObj, contract.delivered.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.delivered, roleObj, contract.delivered.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.delivered.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.delivered))
            //notification
            for (const message of contract.notified.message) {
            if (!oldMessagesList[0].includes(message)) {
                    this.trigger_notification(ctx, message)
                  }
              }
          
           await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
           return {successful: true}
         } else {
           return {successful: false}
         }
       }
       
       async trigger_paidLate(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
       	const contractId = inputs.contractId;
       	const event = inputs.event;
         	const contractState = await ctx.stub.getState(contractId)
         	if (contractState == null) {
       	   		 return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         //notification
         const oldMessagesList = []
         oldMessagesList.push(contract.notified.message.slice())
         this.initialize(contract)
         if (contract.isInEffect()  ){
         	// First security layer
         	try{           	
         	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	
         	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	              throw new Error('Unauthorized: Unknown access'); 
         	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	        // wrong certificate
         	        }
         	
         	    }catch(err){
         	        console.log('access control error: ', err)
         	        return { successful: false, message: err.message }
         	    }// end of first layer
         	    //seond layer
         	    let controllers = contract.paidLate._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.paidLate,roleObj, contract.paidLate.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.paidLate, roleObj, contract.paidLate.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.paidLate.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.paidLate))
            //notification
            for (const message of contract.notified.message) {
            if (!oldMessagesList[0].includes(message)) {
                    this.trigger_notification(ctx, message)
                  }
              }
          
           await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
           return {successful: true}
         } else {
           return {successful: false}
         }
       }
       
       async trigger_paid(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
       	const contractId = inputs.contractId;
       	const event = inputs.event;
         	const contractState = await ctx.stub.getState(contractId)
         	if (contractState == null) {
       	   		 return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         //notification
         const oldMessagesList = []
         oldMessagesList.push(contract.notified.message.slice())
         this.initialize(contract)
         if (contract.isInEffect()  ){
         	// First security layer
         	try{           	
         	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	
         	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	              throw new Error('Unauthorized: Unknown access'); 
         	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	        // wrong certificate
         	        }
         	
         	    }catch(err){
         	        console.log('access control error: ', err)
         	        return { successful: false, message: err.message }
         	    }// end of first layer
         	    //seond layer
         	    let controllers = contract.paid._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.paid,roleObj, contract.paid.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.paid, roleObj, contract.paid.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.paid.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.paid))
            //notification
            for (const message of contract.notified.message) {
            if (!oldMessagesList[0].includes(message)) {
                    this.trigger_notification(ctx, message)
                  }
              }
          
           await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
           return {successful: true}
         } else {
           return {successful: false}
         }
       }
       
       async trigger_temperature(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
       	const contractId = inputs.contractId;
       	const event = inputs.event;
         	const contractState = await ctx.stub.getState(contractId)
         	if (contractState == null) {
       	   		 return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         //notification
         const oldMessagesList = []
         oldMessagesList.push(contract.notified.message.slice())
         this.initialize(contract)
         if (contract.isInEffect()  ){
         	// First security layer
         	try{           	
         	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	
         	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	              throw new Error('Unauthorized: Unknown access'); 
         	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	        // wrong certificate
         	        }
         	
         	    }catch(err){
         	        console.log('access control error: ', err)
         	        return { successful: false, message: err.message }
         	    }// end of first layer
         	    //seond layer
         	    let controllers = contract.temperature._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.temperature,roleObj, contract.temperature.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.temperature, roleObj, contract.temperature.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.temperature.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.temperature))
       //Send notification about datatransfer (i.e., temperature) alert
       let MSG= "sensorId: " + event.sensorId + ", value: " + event.value + ", sensorTimestamp: " + event.sensorTimestamp + ", " + contractId;
       contract.notified.message.push({name: 'temperatureAlert', message: MSG, roles:contract.accessPolicy.permissionValid(contract.temperature,
       contract._roles,contract.temperature.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
            //notification
            for (const message of contract.notified.message) {
            if (!oldMessagesList[0].includes(message)) {
                    this.trigger_notification(ctx, message)
                  }
              }
          
           await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
           return {successful: true}
         } else {
           return {successful: false}
         }
       }
       
       async trigger_humidity(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
       	const contractId = inputs.contractId;
       	const event = inputs.event;
         	const contractState = await ctx.stub.getState(contractId)
         	if (contractState == null) {
       	   		 return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         //notification
         const oldMessagesList = []
         oldMessagesList.push(contract.notified.message.slice())
         this.initialize(contract)
         if (contract.isInEffect()  ){
         	// First security layer
         	try{           	
         	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	
         	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	              throw new Error('Unauthorized: Unknown access'); 
         	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	        // wrong certificate
         	        }
         	
         	    }catch(err){
         	        console.log('access control error: ', err)
         	        return { successful: false, message: err.message }
         	    }// end of first layer
         	    //seond layer
         	    let controllers = contract.humidity._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.humidity,roleObj, contract.humidity.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.humidity, roleObj, contract.humidity.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.humidity.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.humidity))
       //Send notification about datatransfer (i.e., temperature) alert
       let MSG= "sensorId: " + event.sensorId + ", value: " + event.value + ", sensorTimestamp: " + event.sensorTimestamp + ", " + contractId;
       contract.notified.message.push({name: 'humidityAlert', message: MSG, roles:contract.accessPolicy.permissionValid(contract.humidity,
       contract._roles,contract.humidity.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
            //notification
            for (const message of contract.notified.message) {
            if (!oldMessagesList[0].includes(message)) {
                    this.trigger_notification(ctx, message)
                  }
              }
          
           await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
           return {successful: true}
         } else {
           return {successful: false}
         }
       }
       
       async trigger_passwordNotification(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
       	const contractId = inputs.contractId;
       	const event = inputs.event;
         	const contractState = await ctx.stub.getState(contractId)
         	if (contractState == null) {
       	   		 return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         //notification
         const oldMessagesList = []
         oldMessagesList.push(contract.notified.message.slice())
         this.initialize(contract)
         if (contract.isInEffect()  ){
         	// First security layer
         	try{           	
         	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	
         	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	              throw new Error('Unauthorized: Unknown access'); 
         	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	        // wrong certificate
         	        }
         	
         	    }catch(err){
         	        console.log('access control error: ', err)
         	        return { successful: false, message: err.message }
         	    }// end of first layer
         	    //seond layer
         	    let controllers = contract.passwordNotification._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.passwordNotification,roleObj, contract.passwordNotification.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.passwordNotification, roleObj, contract.passwordNotification.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.passwordNotification.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.passwordNotification))
            //notification
            for (const message of contract.notified.message) {
            if (!oldMessagesList[0].includes(message)) {
                    this.trigger_notification(ctx, message)
                  }
              }
          
           await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
           return {successful: true}
         } else {
           return {successful: false}
         }
       }
       
       async trigger_inspectedQuality(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
       	const contractId = inputs.contractId;
       	const event = inputs.event;
         	const contractState = await ctx.stub.getState(contractId)
         	if (contractState == null) {
       	   		 return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         //notification
         const oldMessagesList = []
         oldMessagesList.push(contract.notified.message.slice())
         this.initialize(contract)
         if (contract.isInEffect()  ){
         	// First security layer
         	try{           	
         	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	
         	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	              throw new Error('Unauthorized: Unknown access'); 
         	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	        // wrong certificate
         	        }
         	
         	    }catch(err){
         	        console.log('access control error: ', err)
         	        return { successful: false, message: err.message }
         	    }// end of first layer
         	    //seond layer
         	    let controllers = contract.inspectedQuality._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.inspectedQuality,roleObj, contract.inspectedQuality.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.inspectedQuality, roleObj, contract.inspectedQuality.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.inspectedQuality.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.inspectedQuality))
            //notification
            for (const message of contract.notified.message) {
            if (!oldMessagesList[0].includes(message)) {
                    this.trigger_notification(ctx, message)
                  }
              }
          
           await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
           return {successful: true}
         } else {
           return {successful: false}
         }
       }
       
       async trigger_unLoaded(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
       	const contractId = inputs.contractId;
       	const event = inputs.event;
         	const contractState = await ctx.stub.getState(contractId)
         	if (contractState == null) {
       	   		 return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         //notification
         const oldMessagesList = []
         oldMessagesList.push(contract.notified.message.slice())
         this.initialize(contract)
         if (contract.isInEffect()  ){
         	// First security layer
         	try{           	
         	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	
         	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	              throw new Error('Unauthorized: Unknown access'); 
         	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	        // wrong certificate
         	        }
         	
         	    }catch(err){
         	        console.log('access control error: ', err)
         	        return { successful: false, message: err.message }
         	    }// end of first layer
         	    //seond layer
         	    let controllers = contract.unLoaded._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.unLoaded,roleObj, contract.unLoaded.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.unLoaded, roleObj, contract.unLoaded.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.unLoaded.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.unLoaded))
            //notification
            for (const message of contract.notified.message) {
            if (!oldMessagesList[0].includes(message)) {
                    this.trigger_notification(ctx, message)
                  }
              }
          
           await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
           return {successful: true}
         } else {
           return {successful: false}
         }
       }
       
       async p_suspendDelivery_suspended_o_delivery(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;	
       
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
         if (contract.isInEffect() && contract.powers.suspendDelivery != null && contract.powers.suspendDelivery.isInEffect()) {
               try{
                 //const userId = cid.getID();
           
                  roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
                  cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
           
                        if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
                         throw new Error('Unauthorized: Unknown access'); 
                    //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
                   // wrong certificate
                   }
           
               }catch(err){
                   console.log('access control error: ', err)
                   return { successful: false, message: err.message }
               }// end of first layer
               //seond layer 
             	
                   let controllers = contract.powers.suspendDelivery._controller
           
           if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.suspendDelivery, roleObj, contract.powers.suspendDelivery.getController(controllers.length - 1)) || 
                     !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.suspendDelivery, roleObj, contract.powers.suspendDelivery.getController(controllers.length - 1))) ){
                       throw new Error(`access denied...`)
                     }
            
           let transitionState = contract.obligations.delivery.state;
           const obligation = contract.obligations.delivery
           if (obligation != null && obligation.suspended() && contract.powers.suspendDelivery.exerted()) {
           	    //notify
           	          let MSG= transitionState+" Changed to "+contract.obligations.delivery.state+","+contract.obligations.delivery.name+", " +contractId;
           	          contract.notified.message.push({name: 'contract.obligations.delivery', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.delivery,[contract.obligations.delivery.creditor,contract.obligations.delivery.debtor],contract.obligations.delivery.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
           	
             await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))          
             //notification
             for (const message of contract.notified.message) {
                    this.trigger_notification(ctx, message)
                  }
             return {successful: true}
           } else {
             return {successful: false}
           }
         } else {
           return {successful: false}
         }
       }
       
       async p_resumeDelivery_resumed_o_delivery(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;	
       
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
         if (contract.isInEffect() && contract.powers.resumeDelivery != null && contract.powers.resumeDelivery.isInEffect()) {
               try{
                 //const userId = cid.getID();
           
                  roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
                  cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
           
                        if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
                         throw new Error('Unauthorized: Unknown access'); 
                    //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
                   // wrong certificate
                   }
           
               }catch(err){
                   console.log('access control error: ', err)
                   return { successful: false, message: err.message }
               }// end of first layer
               //seond layer 
             	
                   let controllers = contract.powers.resumeDelivery._controller
           
           if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.resumeDelivery, roleObj, contract.powers.resumeDelivery.getController(controllers.length - 1)) || 
                     !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.resumeDelivery, roleObj, contract.powers.resumeDelivery.getController(controllers.length - 1))) ){
                       throw new Error(`access denied...`)
                     }
            
           let transitionState = contract.obligations.delivery.state;
           const obligation = contract.obligations.delivery
           if (obligation != null && obligation.resumed() && contract.powers.resumeDelivery.exerted()) {
           	    //notify
           	          let MSG= transitionState+" Changed to "+contract.obligations.delivery.state+","+contract.obligations.delivery.name+", " +contractId;
           	          contract.notified.message.push({name: 'contract.obligations.delivery', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.delivery,[contract.obligations.delivery.creditor,contract.obligations.delivery.debtor],contract.obligations.delivery.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
           	
             await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))          
             //notification
             for (const message of contract.notified.message) {
                    this.trigger_notification(ctx, message)
                  }
             return {successful: true}
           } else {
             return {successful: false}
           }
         } else {
           return {successful: false}
         }
       }
       
       async p_terminateContract_terminated_contract(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect() && contract.powers.terminateContract != null && contract.powers.terminateContract.isInEffect()) {
               try{
           
                  roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
                  cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
           
                        if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
                         throw new Error('Unauthorized: Unknown access'); 
                    //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
                   // wrong certificate
                   }
           
               }catch(err){
                   console.log('access control error: ', err)
                   return { successful: false, message: err.message }
               }// end of first layer
               //seond layer 
             	
                   let controllers = contract.powers.terminateContract._controller
           
           if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.terminateContract, roleObj, contract.powers.terminateContract.getController(controllers.length - 1)) || 
                     !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.terminateContract, roleObj, contract.powers.terminateContract.getController(controllers.length - 1))) ){
                       throw new Error(`access denied...`)
                     }
       		// contract state notification
           const stateM="terminated"
       	    //notify
       	      controllers = contract._controller
       	      let MSG= "Contract "+Contract._name+" is "+  stateM+', '+ contractId;
       	      contract.notified.message.push({name: contract._name, message: MSG, roles:contract.accessPolicy.permissionValid(contract,contract._controller,contract.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
       	            
           for (let index in contract.obligations) {
             const obligation = contract.obligations[index]
             obligation.terminated({emitEvent: false})
             controllers = obligation._controller
             let MSG= "Obligation "+obligation.name+" is terminated By Contract termination, "+contractId;
             contract.notified.message.push({name: obligation.name, message: MSG, roles:contract.accessPolicy.permissionValid(obligation,[obligation.creditor,obligation.debtor],obligation.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
             
           }
           for (let index in contract.survivingObligations) {
             const obligation = contract.survivingObligations[index]
             obligation.terminated()
             controllers = obligation._controller
             let MSG= "survivingObligation "+obligation.name+" is terminated By Contract termination, "+contractId;
             contract.notified.message.push({name: obligation.name, message: MSG, roles:contract.accessPolicy.permissionValid(obligation,[obligation.creditor,obligation.debtor],obligation.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
             
           }
           for (let index in contract.powers) {
             const power = contract.powers[index]
             if (index === 'terminateContract') {
               continue;
             }
             power.terminated()
               controllers = power._controller
                let MSG= "Power "+power.name+" is terminated By Contract termination, "+contractId;
                contract.notified.message.push({name: power.name, message: MSG, roles:contract.accessPolicy.permissionValid(power,[power.creditor,power.debtor],power.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
             
           }        
           if (contract.terminated() && contract.powers.terminateContract.exerted()) {
       	 //notification
             for (const message of contract.notified.message) {
                    this.trigger_notification(ctx, message)
                  }
           	
             await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
             return {successful: true}
           } else {
             return {successful: false}
           }
         } else {
           return {successful: false}
         }
       }
       
       async violateObligation_inspectMeat(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.inspectMeat != null){
         	            try{
         	        
         	               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	        
         	                     if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	                      throw new Error('Unauthorized: Unknown access'); 
         	                 //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	                // wrong certificate
         	                }
         	        
         	            }catch(err){
         	                console.log('access control error: ', err)
         	                return { successful: false, message: err.message }
         	            }// end of first layer
         	            //seond layer 
         	          	
         	                let controllers = contract.obligations.inspectMeat._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.inspectMeat, roleObj, contract.obligations.inspectMeat.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.inspectMeat, roleObj, contract.obligations.inspectMeat.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
         	            let transitionState = contract.obligations.inspectMeat.state;
           	if (contract.obligations.inspectMeat.violated()) {      
             		await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))        
             		//notify
             		let MSG= transitionState+" Changed to "+contract.obligations.inspectMeat.state+","+contract.obligations.inspectMeat.name+", " + contractId;
             		contract.notified.message.push({name: 'contract.obligations.inspectMeat', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.inspectMeat,[contract.obligations.inspectMeat.creditor,contract.obligations.inspectMeat.debtor],contract.obligations.inspectMeat.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
       	  		        //notification
       	  		        for (const message of contract.notified.message) {
       	  		                 this.trigger_notification(ctx, message)
       	  		             }
             		
             		return {successful: true}
           	} else {
             		return {successful: false}
           	}
           }else {
                       return {successful: false}
                     }
         } else {
           return {successful: false}
         }
       }
       
       async violateObligation_latePayment(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.latePayment != null){
         	            try{
         	        
         	               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	        
         	                     if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	                      throw new Error('Unauthorized: Unknown access'); 
         	                 //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	                // wrong certificate
         	                }
         	        
         	            }catch(err){
         	                console.log('access control error: ', err)
         	                return { successful: false, message: err.message }
         	            }// end of first layer
         	            //seond layer 
         	          	
         	                let controllers = contract.obligations.latePayment._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.latePayment, roleObj, contract.obligations.latePayment.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.latePayment, roleObj, contract.obligations.latePayment.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
         	            let transitionState = contract.obligations.latePayment.state;
           	if (contract.obligations.latePayment.violated()) {      
             		await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))        
             		//notify
             		let MSG= transitionState+" Changed to "+contract.obligations.latePayment.state+","+contract.obligations.latePayment.name+", " + contractId;
             		contract.notified.message.push({name: 'contract.obligations.latePayment', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.latePayment,[contract.obligations.latePayment.creditor,contract.obligations.latePayment.debtor],contract.obligations.latePayment.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
       	  		        //notification
       	  		        for (const message of contract.notified.message) {
       	  		                 this.trigger_notification(ctx, message)
       	  		             }
             		
             		return {successful: true}
           	} else {
             		return {successful: false}
           	}
           }else {
                       return {successful: false}
                     }
         } else {
           return {successful: false}
         }
       }
       
       async violateObligation_delivery(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.delivery != null){
         	            try{
         	        
         	               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	        
         	                     if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	                      throw new Error('Unauthorized: Unknown access'); 
         	                 //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	                // wrong certificate
         	                }
         	        
         	            }catch(err){
         	                console.log('access control error: ', err)
         	                return { successful: false, message: err.message }
         	            }// end of first layer
         	            //seond layer 
         	          	
         	                let controllers = contract.obligations.delivery._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.delivery, roleObj, contract.obligations.delivery.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.delivery, roleObj, contract.obligations.delivery.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
         	            let transitionState = contract.obligations.delivery.state;
           	if (contract.obligations.delivery.violated()) {      
             		await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))        
             		//notify
             		let MSG= transitionState+" Changed to "+contract.obligations.delivery.state+","+contract.obligations.delivery.name+", " + contractId;
             		contract.notified.message.push({name: 'contract.obligations.delivery', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.delivery,[contract.obligations.delivery.creditor,contract.obligations.delivery.debtor],contract.obligations.delivery.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
       	  		        //notification
       	  		        for (const message of contract.notified.message) {
       	  		                 this.trigger_notification(ctx, message)
       	  		             }
             		
             		return {successful: true}
           	} else {
             		return {successful: false}
           	}
           }else {
                       return {successful: false}
                     }
         } else {
           return {successful: false}
         }
       }
       
       async violateObligation_payment(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.payment != null){
         	            try{
         	        
         	               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	        
         	                     if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	                      throw new Error('Unauthorized: Unknown access'); 
         	                 //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	                // wrong certificate
         	                }
         	        
         	            }catch(err){
         	                console.log('access control error: ', err)
         	                return { successful: false, message: err.message }
         	            }// end of first layer
         	            //seond layer 
         	          	
         	                let controllers = contract.obligations.payment._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.payment, roleObj, contract.obligations.payment.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.payment, roleObj, contract.obligations.payment.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
         	            let transitionState = contract.obligations.payment.state;
           	if (contract.obligations.payment.violated()) {      
             		await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))        
             		//notify
             		let MSG= transitionState+" Changed to "+contract.obligations.payment.state+","+contract.obligations.payment.name+", " + contractId;
             		contract.notified.message.push({name: 'contract.obligations.payment', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.payment,[contract.obligations.payment.creditor,contract.obligations.payment.debtor],contract.obligations.payment.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
       	  		        //notification
       	  		        for (const message of contract.notified.message) {
       	  		                 this.trigger_notification(ctx, message)
       	  		             }
             		
             		return {successful: true}
           	} else {
             		return {successful: false}
           	}
           }else {
                       return {successful: false}
                     }
         } else {
           return {successful: false}
         }
       }
       
       async expireObligation_inspectMeat(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.inspectMeat != null){
       				try{
       				          	        
             	               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
             	               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
             	        
             	                     if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
             	                      throw new Error('Unauthorized: Unknown access'); 
             	                 //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
             	                // wrong certificate
             	                }
             	        
             	            }catch(err){
             	                console.log('access control error: ', err)
             	                return { successful: false, message: err.message }
             	            }// end of first layer
             	            //seond layer 
             	          	
             	                let controllers = contract.obligations.inspectMeat._controller
       				  	        
       				  	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.inspectMeat, roleObj, contract.obligations.inspectMeat.getController(controllers.length - 1)) || 
       				  	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.inspectMeat, roleObj, contract.obligations.inspectMeat.getController(controllers.length - 1))) ){
       				  	                    throw new Error(`access denied...`)
       				  	                  }
       				let transitionState = contract.obligations.inspectMeat.state;
           	
           	if (contract.obligations.inspectMeat.expired()) {         
              		//notify
              		let MSG= transitionState+" Changed to "+contract.obligations.inspectMeat.state+","+contract.obligations.inspectMeat.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.obligations.inspectMeat', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.inspectMeat,[contract.obligations.inspectMeat.creditor,contract.obligations.inspectMeat.debtor],contract.obligations.inspectMeat.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
        	  		        //notification
        	  		        for (const message of contract.notified.message) {
        	  		                 this.trigger_notification(ctx, message)
        	  		             }
           		               		    
            		 await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
             		 return {successful: true}
           	} else {
             		return {successful: false}
          		 }
          } else {
            		return {successful: false}
                   }		 
         } else {
           return {successful: false}
         }
       }
       
       async expireObligation_payment(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.payment != null){
       				try{
       				          	        
             	               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
             	               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
             	        
             	                     if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
             	                      throw new Error('Unauthorized: Unknown access'); 
             	                 //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
             	                // wrong certificate
             	                }
             	        
             	            }catch(err){
             	                console.log('access control error: ', err)
             	                return { successful: false, message: err.message }
             	            }// end of first layer
             	            //seond layer 
             	          	
             	                let controllers = contract.obligations.payment._controller
       				  	        
       				  	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.payment, roleObj, contract.obligations.payment.getController(controllers.length - 1)) || 
       				  	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.payment, roleObj, contract.obligations.payment.getController(controllers.length - 1))) ){
       				  	                    throw new Error(`access denied...`)
       				  	                  }
       				let transitionState = contract.obligations.payment.state;
           	
           	if (contract.obligations.payment.expired()) {         
              		//notify
              		let MSG= transitionState+" Changed to "+contract.obligations.payment.state+","+contract.obligations.payment.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.obligations.payment', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.payment,[contract.obligations.payment.creditor,contract.obligations.payment.debtor],contract.obligations.payment.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
        	  		        //notification
        	  		        for (const message of contract.notified.message) {
        	  		                 this.trigger_notification(ctx, message)
        	  		             }
           		               		    
            		 await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
             		 return {successful: true}
           	} else {
             		return {successful: false}
          		 }
          } else {
            		return {successful: false}
                   }		 
         } else {
           return {successful: false}
         }
       }
       
       async expirePower_suspendDelivery(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
           let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
         	            try{
         	        
         	               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	        
         	                     if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	                      throw new Error('Unauthorized: Unknown access'); 
         	                 //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	                // wrong certificate
         	                }
         	        
         	            }catch(err){
         	                console.log('access control error: ', err)
         	                return { successful: false, message: err.message }
         	            }// end of first layer
         	            //seond layer 
         	          	
         	         let controllers = contract.powers.suspendDelivery._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.suspendDelivery, roleObj, contract.powers.suspendDelivery.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.suspendDelivery, roleObj, contract.powers.suspendDelivery.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
       			let transitionState = contract.powers.suspendDelivery.state;
           if (contract.powers.suspendDelivery.expired()) {   
              		//notify
              		let MSG= transitionState+" Changed to "+contract.powers.suspendDelivery.state+","+contract.powers.suspendDelivery.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.powers.suspendDelivery', message: MSG, roles:contract.accessPolicy.permissionValid(contract.powers.suspendDelivery,[contract.powers.suspendDelivery.creditor,contract.powers.suspendDelivery.debtor],contract.powers.suspendDelivery.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
        	  		        //notification
        	  		        for (const message of contract.notified.message) {
        	  		                 this.trigger_notification(ctx, message)
        	  		             }   
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
       	const cid = new ClientIdentity(ctx.stub);
           let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
         	            try{
         	        
         	               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	        
         	                     if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	                      throw new Error('Unauthorized: Unknown access'); 
         	                 //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	                // wrong certificate
         	                }
         	        
         	            }catch(err){
         	                console.log('access control error: ', err)
         	                return { successful: false, message: err.message }
         	            }// end of first layer
         	            //seond layer 
         	          	
         	         let controllers = contract.powers.resumeDelivery._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.resumeDelivery, roleObj, contract.powers.resumeDelivery.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.resumeDelivery, roleObj, contract.powers.resumeDelivery.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
       			let transitionState = contract.powers.resumeDelivery.state;
           if (contract.powers.resumeDelivery.expired()) {   
              		//notify
              		let MSG= transitionState+" Changed to "+contract.powers.resumeDelivery.state+","+contract.powers.resumeDelivery.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.powers.resumeDelivery', message: MSG, roles:contract.accessPolicy.permissionValid(contract.powers.resumeDelivery,[contract.powers.resumeDelivery.creditor,contract.powers.resumeDelivery.debtor],contract.powers.resumeDelivery.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
        	  		        //notification
        	  		        for (const message of contract.notified.message) {
        	  		                 this.trigger_notification(ctx, message)
        	  		             }   
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
       	const cid = new ClientIdentity(ctx.stub);
           let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
         	            try{
         	        
         	               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
         	               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
         	        
         	                     if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
         	                      throw new Error('Unauthorized: Unknown access'); 
         	                 //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
         	                // wrong certificate
         	                }
         	        
         	            }catch(err){
         	                console.log('access control error: ', err)
         	                return { successful: false, message: err.message }
         	            }// end of first layer
         	            //seond layer 
         	          	
         	         let controllers = contract.powers.terminateContract._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.terminateContract, roleObj, contract.powers.terminateContract.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.terminateContract, roleObj, contract.powers.terminateContract.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
       			let transitionState = contract.powers.terminateContract.state;
           if (contract.powers.terminateContract.expired()) {   
              		//notify
              		let MSG= transitionState+" Changed to "+contract.powers.terminateContract.state+","+contract.powers.terminateContract.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.powers.terminateContract', message: MSG, roles:contract.accessPolicy.permissionValid(contract.powers.terminateContract,[contract.powers.terminateContract.creditor,contract.powers.terminateContract.debtor],contract.powers.terminateContract.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
        	  		        //notification
        	  		        for (const message of contract.notified.message) {
        	  		                 this.trigger_notification(ctx, message)
        	  		             }   
             await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
             return {successful: true}
           } else {
             return {successful: false}
           }
           } else {
                         return {successful: false}
                       }
       }
       

         //notification
         async trigger_notification(ctx, event) {
       
         console.log("trigger_notification")
         console.log(event)
         await ctx.stub.setEvent(event.name, Buffer.from(JSON.stringify({
             event: event
           })));
         
         return {successful: true}
       }
      
        /**
          * Stores the hardcoded rolesList in the ledger as ACPolicyRecord with a signed hash.
          * Can only be called by Regulator or Admin.
          * Input is not accepted to prevent tampering.
          */
         async storeRolesPolicy(ctx, contractId) {
           console.log("I am in storeRolesPolicy")
           
           let roleObj;
           const contractState = await ctx.stub.getState(contractId)
           if (contractState == null) {
             return {successful: false}
           }
           const contract = deserialize(contractState.toString())
           this.initialize(contract)
       
           //
           const cid = new ClientIdentity(ctx.stub);
           const userId = cid.getID();
           const role = cid.getAttributeValue('HF.role');
           
           console.log("Attr name")
           console.log(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
               cid.getAttributeValue('organization'), cid.getAttributeValue('department'))
       
           try{
             if (role !== 'Admin' && role !== 'Regulator') {
       
             throw new Error('Only Admin or Regulator can trigger roles policy storage');
            }else{
               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
       
                    if(roleObj === null ){ 
                     throw new Error('Unauthorized: Unknown access'); 
       
               }
            }//else
            }catch(err){
               console.log('access control error: ', err)
               return { successful: false, message: err.message }
              }// end of first layer
       
           // Build roles policy from contract spec
           const policy = {
             roles: contract._roles.map(role => ({
               name: role._name,
               type: role._type,
               dept: role.dept._value,
               org: role.org._value
             })),
             metadata: {
               storedBy: cid.getID(),
               timestamp: new Date().toISOString()
             }
           };
       
           const policyStr = JSON.stringify(policy);
           const policyHash = crypto.createHash('sha256').update(policyStr).digest();
       
           const record = {
             hash: policyHash.toString('hex'),
             policy,
             verified: true,
             signer: userId
           };
       
           await ctx.stub.putState('ACPolicyRecord', Buffer.from(JSON.stringify(record)));
       
           // Emit tamper-proof event
           await ctx.stub.setEvent('ACPolicyStored', Buffer.from(JSON.stringify({
             accessor: userId,
             role,
             hash: policyHash.toString('hex'),
             time: new Date().toISOString()
           })));
       
           return {
             successful: true,
             hash: policyHash.toString('hex'),
             message: 'ACPolicy stored successfully with verified signature'
           };
         }
           //AC -- get rules for IoT and CEP
           async getIoTCondition(ctx, contractId) {
                      
                       let roleObj;
                       let contractState = await ctx.stub.getState(contractId)
                       if (contractState == null) {
                         return {successful: false}
                       }
                       const contract = deserialize(contractState.toString())
                       this.initialize(contract)
                   
                       //
                       const cid = new ClientIdentity(ctx.stub);
                       const userId = cid.getID();
                       const role = cid.getAttributeValue('HF.role');
                       
                       console.log("Attr name in getPolicy")
                       console.log(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
                           cid.getAttributeValue('organization'), cid.getAttributeValue('department'))
                   
                       try{
                         if (role !== 'Admin' && role !== 'Regulator') {
                   
                         throw new Error('Only Admin or Regulator can trigger getIoTCondition');
                        }else{
                           roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
                           cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
                   
                                if(roleObj === null ){ 
                                 throw new Error('Unauthorized: Unknown access'); 
                   
                           }
                        }//else
                        }catch(err){
                           console.log('access control error: ', err)
                           return { successful: false, message: err.message }
                          }// end of first layer
              
              contractState = await ctx.stub.getState(contractId) 
              let rules = { rules: [], roles: [] };
              
              const eventList = [
                'temperature', 'humidity'
              ];
              
             for (const key of eventList) {
             
               // skip undefined contract entries
               if (contract[key] === undefined) continue;
               if (!contract.hasOwnProperty(key)) continue;
             
               const dObj = contract[key];
             
               rules.rules.push({
                 id: dObj._name + "Rule",
                 contractId: contractId,
                 chaincodeName: "meatsalesharedparty",
                 eventType: "SensorEvent",
                 sensorType: dObj._name,
                 sensorId: dObj.sensorId,
                 condition:(dObj.condition._value.trim() === "")? "": dObj.condition._value,
                 window: (dObj.window._value.trim() === "")? "": "time("+dObj.window._value+ " min)",
                 having: (dObj.count._value.trim() === "")? "":"count(*) > " +dObj.count._value,
                 select: "sensorId, sensorTimestamp"+((dObj.count._value.trim() === "")? ", value " : ", count(*) as cnt, avg(value)")+" as avgValue",
                 chaincodeFunction: "trigger_" + dObj._name
               });
             }
              // -------------------------------
              // Build roles list from contract
              // -------------------------------
              rules.roles = contract._roles.map(role => role.name._value);
              
              // metadata block
              rules.metadata = {
                storedBy: cid.getID(),
                timestamp: new Date().toISOString()
              };
                      
                          const ruleStr = JSON.stringify(rules);
                          const ruleHash = crypto.createHash('sha256').update(ruleStr).digest();                      
                          const record = {
                            hash: ruleHash.toString('hex'),
                            rules,
                            verified: true,
                            signer: userId
                          };
                          
           return {
             successful: true,
             message: 'Retrieved successfully',
             record: record
           };                      

                        }
       
         /**
          * Allows CAAdmin or Regulator to retrieve the stored ACPolicy.
          */
         async getRolePolicy(ctx, contractId) {
          
           let roleObj;
           const contractState = await ctx.stub.getState(contractId)
           if (contractState == null) {
             return {successful: false}
           }
           const contract = deserialize(contractState.toString())
           this.initialize(contract)
       
           //
           const cid = new ClientIdentity(ctx.stub);
           const userId = cid.getID();
           const role = cid.getAttributeValue('HF.role');
           
           console.log("Attr name in getPolicy")
           console.log(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
               cid.getAttributeValue('organization'), cid.getAttributeValue('department'))
       
           try{
             if (role !== 'Admin' && role !== 'Regulator') {
       
             throw new Error('Only Admin or Regulator can trigger roles policy storage');
            }else{
               roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
               cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
       
                    if(roleObj === null ){ 
                     throw new Error('Unauthorized: Unknown access'); 
       
               }
            }//else
            }catch(err){
               console.log('access control error: ', err)
               return { successful: false, message: err.message }
              }// end of first layer
       
           const policyBytes = await ctx.stub.getState('ACPolicyRecord');
           if (!policyBytes || policyBytes.length === 0) {
             return { successful: false, message: 'ACPolicyRecord not found' };
           }
       
           const policy = JSON.parse(policyBytes.toString());
       
           // Emit access event for auditing
           await ctx.stub.setEvent('ACPolicyAccessed', Buffer.from(JSON.stringify({
             accessor: userId,
             role,
             time: new Date().toISOString()
           })));
       
           return {
             successful: true,
             message: 'ACPolicy retrieved successfully',
             policyRecord: policy
           };
         }
       
       //get Date And Time of any event
       async getEventDateAndTime(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	        	        	let roleObj;
           const inputs = JSON.parse(args);
           const contractId = inputs.contractId;
           const requiredResource = inputs.event
           let output = {}
           const contractState = await ctx.stub.getState(contractId)
           if (contractState == null) {
             return {successful: false}
           }
           const contract = deserialize(contractState.toString())
           this.initialize(contract)
           try{           	
                             	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
                             	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
                             	
                             	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
                             	              throw new Error('Unauthorized: Unknown access'); 
                             	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
                             	        // wrong certificate
                             	        }
                             	
                             	    }catch(err){
                             	        console.log('access control error: ', err)
                             	        return { successful: false, message: err.message }
                             	    }// end of first layer
                             	    //seond layer
           let eventObj = contract.findObject(requiredResource.event, requiredResource._type, contract)
           if (  eventObj != null){
           let controllers = eventObj._controller
           if(contract.accessPolicy.hasPermesstion('grant','read', eventObj, roleObj, eventObj.getController(controllers.length - 1)) || contract.accessPolicy.hasPermesstionOnLegalPosition('grant','read', eventObj, roleObj, eventObj.getController(controllers.length - 1))){
             output = {time: eventObj.getHappenedTime(), state: eventObj.hasHappened()  ? "Happened" : "Not Happened"}  
           }else{
             throw new Error(`access denied...`)
           }
           return output
           }else{ throw new Error(`The event is not exist...`)}
         }
         //AC -- access state, time for legalpositions (obligation and power) by authorized roles 
       async getLegalPositionStateAndTime(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	        	        	let roleObj;
         const inputs = JSON.parse(args);
         const contractId = inputs.contractId;
         const quiredState = inputs.quiredState.state
         const requiredResource = inputs.quiredState.resource
         const requiredResourceType = inputs.quiredState.resourceType
     
         let output = {}
       	const contractState = await ctx.stub.getState(contractId)
       	if (contractState == null) {
       	  return {successful: false}
       	}
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
     		try{           	
   	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
   	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
   	
   	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
   	              throw new Error('Unauthorized: Unknown access'); 
   	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
   	        // wrong certificate
   	        }
   	
   	    }catch(err){
   	        console.log('access control error: ', err)
   	        return { successful: false, message: err.message }
   	    }// end of first layer
   	    //seond layer
         const aResource = contract.findLegalPosition(requiredResource, requiredResourceType, contract)
         if(aResource !== null){
         	let controllers = aResource._controller
           switch(requiredResourceType.toLowerCase()){
            case 'obligation':
              if(contract.accessPolicy.hasPermesstion('grant','read', aResource, roleObj, aResource.getController(controllers.length - 1))) {
                  output= contract.findStateTimeLegalPosition(aResource)
         }else{
           throw new Error(`access denied...`)
         }
         break
         case 'power': 
           if(contract.accessPolicy.hasPermesstion('grant','read', aResource, roleObj, aResource.getController(controllers.length - 1))) {
                output=contract.findStateTimeLegalPosition(aResource)
           }else{
             throw new Error(`access denied...`)
           }
         }// outer switch
         } else{throw new Error(`Resource is not exist...`)}//if (aResource == null)
       
         return output
         
       }
       
       // Access the state and time of the parts of the legalpositions
       async getStateTimeOfParts(ctx, args){
       	const cid = new ClientIdentity(ctx.stub);
       	        	let roleObj;
        const inputs = JSON.parse(args);
        const contractId = inputs.contractId;
        const requiredResource = inputs.condition
       
        let output = {}
       
        const contractState = await ctx.stub.getState(contractId)
        if (contractState == null) {
          return {successful: false}
        }
           const contract = deserialize(contractState.toString())
           this.initialize(contract)
       // First security layer
                 	try{           	
                 	       roleObj = contract.authenticate(cid.getAttributeValue('HF.role'), cid.getAttributeValue('HF.name'), 
                 	       cid.getAttributeValue('organization'), cid.getAttributeValue('department'),contract)
                 	
                 	             if(roleObj === null ){ // this mean the roleObj (role who calls the transaction) exist in our conttract
                 	              throw new Error('Unauthorized: Unknown access'); 
                 	         //roleObj: we do not have a role that has the same name and type that calls the transaction like e.g., there is no shipper
                 	        // wrong certificate
                 	        }
                 	
                 	    }catch(err){
                 	        console.log('access control error: ', err)
                 	        return { successful: false, message: err.message }
                 	    }// end of first layer
                 	    //seond layer
                 	    
        const aLegalPositionIncodition = contract.findLegalPosition(requiredResource.resource, requiredResource.resourceType, contract)
        if(aLegalPositionIncodition !==null){
        	let controllers = aLegalPositionIncodition._controller
           switch(requiredResource._type.toLowerCase()){
             case 'statecondition':          
               if(contract.accessPolicy.hasPermesstionOnLegalPosition('grant','read', requiredResource, roleObj, aLegalPositionIncodition.getController(controllers.length - 1),contract)){
                 output=contract.findStateTimeLegalPosition(aLegalPositionIncodition)
                  if(output.State !== null && output.State !== undefined ){
                    if (output.State.toLowerCase() !== requiredResource.state.toLowerCase() ) {
                         output = {state: requiredResource.state.toLowerCase()+' is Not Happened', time: null}
                      }
                    }
               } else{
                   throw new Error(`access denied...`)
               }
             break
             
             case 'condition': 
               if(contract.accessPolicy.hasPermesstionOnLegalPosition('grant','read', requiredResource, roleObj, aLegalPositionIncodition.getController(controllers.length - 1),contract)){
                 let conditionValue = eval(requiredResource.leftSide + " " + requiredResource.op + " " + requiredResource.rightSide)
                 output = {state: conditionValue, time: null}
               }else{
                     throw new Error(`access denied...`)
               }
             break
           
             case 'eventcondition':
               if(contract.accessPolicy.hasPermesstionOnLegalPosition('grant','read', requiredResource, roleObj, aLegalPositionIncodition.getController(controllers.length - 1),contract)){
                  let eventObj = contract.findObject(requiredResource.partResource, requiredResource.partResourceType, contract)
                  output = {time: eventObj.getHappenedTime(), state: eventObj.hasHappened()  ? "Happened" : "Not Happened"}
               }else{
                    throw new Error(`access denied...`)
               }
             break
             
             default: throw new Error(`This is not a valid part of legal situation...`)
           }
           
        }else {throw new Error(`Resource is not exist...`)}
       
        return output
       
       }
       
      // Return the states of the contract and its parts     
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
         if (contract.temperature._triggered) {
           output += `  Event "temperature" happened at ${contract.temperature._timestamp}\r\n`
         } else {
           output += `  Event "temperature" has not happened\r\n`
         }
         if (contract.humidity._triggered) {
           output += `  Event "humidity" happened at ${contract.humidity._timestamp}\r\n`
         } else {
           output += `  Event "humidity" has not happened\r\n`
         }
         if (contract.passwordNotification._triggered) {
           output += `  Event "passwordNotification" happened at ${contract.passwordNotification._timestamp}\r\n`
         } else {
           output += `  Event "passwordNotification" has not happened\r\n`
         }
         if (contract.inspectedQuality._triggered) {
           output += `  Event "inspectedQuality" happened at ${contract.inspectedQuality._timestamp}\r\n`
         } else {
           output += `  Event "inspectedQuality" has not happened\r\n`
         }
         if (contract.unLoaded._triggered) {
           output += `  Event "unLoaded" happened at ${contract.unLoaded._timestamp}\r\n`
         } else {
           output += `  Event "unLoaded" has not happened\r\n`
         }
         
         return output
       }
     }
     
     module.exports.contracts = [HFContract];

