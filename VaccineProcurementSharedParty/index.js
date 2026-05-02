     const { Contract } = require("fabric-contract-api")
     const { VaccineProcurementSharedParty } = require("./domain/contract/VaccineProcurementSharedParty.js")
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
         super('VaccineProcurementSharedParty');
         
       }
     
       initialize(contract) {
         Events.init(getEventMap(contract), EventListeners)
       }
     
       async init(ctx, args) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
       	const inputs = JSON.parse(args);
         const contractInstance = new VaccineProcurementSharedParty (inputs.pfizerP, inputs.buyerP, inputs.regulatorP, inputs.adminP, inputs.fdaP, inputs.worldcourierP, inputs.approval, inputs.unitPrice, inputs.minQuantity, inputs.maxQuantity)
         this.initialize(contractInstance)
         if (contractInstance.activated()) {
           // call trigger transitions for legal positions
           contractInstance.obligations.oRequestVaccineDosage.trigerredUnconditional()
           contractInstance.survivingObligations.oWithdrewApproval.trigerredConditional()
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
     
       async trigger_requested(ctx, args) {
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
         	    let controllers = contract.requested._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.requested,roleObj, contract.requested.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.requested, roleObj, contract.requested.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.requested.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.requested))
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
       
       async trigger_leadtimeINform(ctx, args) {
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
         	    let controllers = contract.leadtimeINform._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.leadtimeINform,roleObj, contract.leadtimeINform.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.leadtimeINform, roleObj, contract.leadtimeINform.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.leadtimeINform.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.leadtimeINform))
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
       
       async trigger_notifiedOD(ctx, args) {
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
         	    let controllers = contract.notifiedOD._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.notifiedOD,roleObj, contract.notifiedOD.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.notifiedOD, roleObj, contract.notifiedOD.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.notifiedOD.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.notifiedOD))
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
       
       async trigger_invoiced(ctx, args) {
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
         if (contract.isInEffect()  || contract.isSuccessfulTermination() || contract.isUnsuccessfulTermination() ){
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
         	    let controllers = contract.invoiced._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.invoiced,roleObj, contract.invoiced.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.invoiced, roleObj, contract.invoiced.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.invoiced.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.invoiced))
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
         if (contract.isInEffect()  || contract.isSuccessfulTermination() || contract.isUnsuccessfulTermination() ){
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
       
       async trigger_confirmed(ctx, args) {
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
         	    let controllers = contract.confirmed._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.confirmed,roleObj, contract.confirmed.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.confirmed, roleObj, contract.confirmed.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.confirmed.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.confirmed))
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
       
       async trigger_lawStopWork(ctx, args) {
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
         	    let controllers = contract.lawStopWork._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.lawStopWork,roleObj, contract.lawStopWork.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.lawStopWork, roleObj, contract.lawStopWork.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.lawStopWork.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.lawStopWork))
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
       
       async trigger_regulationStopWork(ctx, args) {
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
         	    let controllers = contract.regulationStopWork._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.regulationStopWork,roleObj, contract.regulationStopWork.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.regulationStopWork, roleObj, contract.regulationStopWork.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.regulationStopWork.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.regulationStopWork))
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
       
       async trigger_judicialStopWork(ctx, args) {
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
         	    let controllers = contract.judicialStopWork._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.judicialStopWork,roleObj, contract.judicialStopWork.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.judicialStopWork, roleObj, contract.judicialStopWork.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.judicialStopWork.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.judicialStopWork))
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
       
       async trigger_adminStopWork(ctx, args) {
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
         	    let controllers = contract.adminStopWork._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.adminStopWork,roleObj, contract.adminStopWork.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.adminStopWork, roleObj, contract.adminStopWork.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.adminStopWork.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.adminStopWork))
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
       
       async trigger_govStopWork(ctx, args) {
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
         	    let controllers = contract.govStopWork._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.govStopWork,roleObj, contract.govStopWork.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.govStopWork, roleObj, contract.govStopWork.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.govStopWork.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.govStopWork))
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
       
       async trigger_agreedFromG(ctx, args) {
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
         	    let controllers = contract.agreedFromG._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.agreedFromG,roleObj, contract.agreedFromG.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.agreedFromG, roleObj, contract.agreedFromG.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.agreedFromG.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.agreedFromG))
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
       
       async trigger_outsideRisk(ctx, args) {
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
         	    let controllers = contract.outsideRisk._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.outsideRisk,roleObj, contract.outsideRisk.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.outsideRisk, roleObj, contract.outsideRisk.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.outsideRisk.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.outsideRisk))
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
       
       async trigger_withdrewApproval(ctx, args) {
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
         if (contract.isInEffect()  || contract.isSuccessfulTermination() || contract.isUnsuccessfulTermination() ){
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
         	    let controllers = contract.withdrewApproval._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.withdrewApproval,roleObj, contract.withdrewApproval.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.withdrewApproval, roleObj, contract.withdrewApproval.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.withdrewApproval.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.withdrewApproval))
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
       
       async trigger_buyerTerminateAgreement(ctx, args) {
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
         	    let controllers = contract.buyerTerminateAgreement._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.buyerTerminateAgreement,roleObj, contract.buyerTerminateAgreement.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.buyerTerminateAgreement, roleObj, contract.buyerTerminateAgreement.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.buyerTerminateAgreement.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.buyerTerminateAgreement))
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
       
       async trigger_pfizerTerminateAgreement(ctx, args) {
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
         	    let controllers = contract.pfizerTerminateAgreement._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.pfizerTerminateAgreement,roleObj, contract.pfizerTerminateAgreement.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.pfizerTerminateAgreement, roleObj, contract.pfizerTerminateAgreement.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.pfizerTerminateAgreement.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.pfizerTerminateAgreement))
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
       
       async trigger_shock(ctx, args) {
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
         	    let controllers = contract.shock._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.shock,roleObj, contract.shock.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.shock, roleObj, contract.shock.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.shock.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.shock))
       //Send notification about datatransfer (i.e., temperature) alert
       let MSG= "sensorId: " + event.sensorId + ", value: " + event.value + ", sensorTimestamp: " + event.sensorTimestamp + ", " + contractId;
       contract.notified.message.push({name: 'shockAlert', message: MSG, roles:contract.accessPolicy.permissionValid(contract.shock,
       contract._roles,contract.shock.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
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
       
       async trigger_lightExposure(ctx, args) {
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
         	    let controllers = contract.lightExposure._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.lightExposure,roleObj, contract.lightExposure.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.lightExposure, roleObj, contract.lightExposure.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.lightExposure.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.lightExposure))
       //Send notification about datatransfer (i.e., temperature) alert
       let MSG= "sensorId: " + event.sensorId + ", value: " + event.value + ", sensorTimestamp: " + event.sensorTimestamp + ", " + contractId;
       contract.notified.message.push({name: 'lightExposureAlert', message: MSG, roles:contract.accessPolicy.permissionValid(contract.lightExposure,
       contract._roles,contract.lightExposure.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
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
       
       async trigger_sealOpen(ctx, args) {
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
         	    let controllers = contract.sealOpen._controller
         	if(!contract.accessPolicy.hasPermesstion('grant','read', contract.sealOpen,roleObj, contract.sealOpen.getController(controllers.length - 1)) || 
         	      !contract.accessPolicy.isValid(new Rule('grant','read', contract.sealOpen, roleObj, contract.sealOpen.getController(controllers.length - 1))) ){
         	        throw new Error(`access denied...`)
         	      }
           contract.sealOpen.happen(event)
           Events.emitEvent(contract, new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.sealOpen))
       //Send notification about datatransfer (i.e., temperature) alert
       let MSG= "sensorId: " + event.sensorId + ", value: " + event.value + ", sensorTimestamp: " + event.sensorTimestamp + ", " + contractId;
       contract.notified.message.push({name: 'sealOpenAlert', message: MSG, roles:contract.accessPolicy.permissionValid(contract.sealOpen,
       contract._roles,contract.sealOpen.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
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
       
       async p_pStopWork_terminated_contract(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect() && contract.powers.pStopWork != null && contract.powers.pStopWork.isInEffect()) {
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
             	
                   let controllers = contract.powers.pStopWork._controller
           
           if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.pStopWork, roleObj, contract.powers.pStopWork.getController(controllers.length - 1)) || 
                     !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.pStopWork, roleObj, contract.powers.pStopWork.getController(controllers.length - 1))) ){
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
             if (index === 'pStopWork') {
               continue;
             }
             power.terminated()
               controllers = power._controller
                let MSG= "Power "+power.name+" is terminated By Contract termination, "+contractId;
                contract.notified.message.push({name: power.name, message: MSG, roles:contract.accessPolicy.permissionValid(power,[power.creditor,power.debtor],power.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
             
           }        
           if (contract.terminated() && contract.powers.pStopWork.exerted()) {
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
       
       async p_pTermination_terminated_contract(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect() && contract.powers.pTermination != null && contract.powers.pTermination.isInEffect()) {
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
             	
                   let controllers = contract.powers.pTermination._controller
           
           if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.pTermination, roleObj, contract.powers.pTermination.getController(controllers.length - 1)) || 
                     !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.pTermination, roleObj, contract.powers.pTermination.getController(controllers.length - 1))) ){
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
             if (index === 'pTermination') {
               continue;
             }
             power.terminated()
               controllers = power._controller
                let MSG= "Power "+power.name+" is terminated By Contract termination, "+contractId;
                contract.notified.message.push({name: power.name, message: MSG, roles:contract.accessPolicy.permissionValid(power,[power.creditor,power.debtor],power.getController(controllers.length - 1), contract) , time: new Date().toISOString()})
             
           }        
           if (contract.terminated() && contract.powers.pTermination.exerted()) {
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
       
       async violateObligation_oAgreedOnRequest(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.oAgreedOnRequest != null){
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
         	          	
         	                let controllers = contract.obligations.oAgreedOnRequest._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.oAgreedOnRequest, roleObj, contract.obligations.oAgreedOnRequest.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.oAgreedOnRequest, roleObj, contract.obligations.oAgreedOnRequest.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
         	            let transitionState = contract.obligations.oAgreedOnRequest.state;
           	if (contract.obligations.oAgreedOnRequest.violated()) {      
             		await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))        
             		//notify
             		let MSG= transitionState+" Changed to "+contract.obligations.oAgreedOnRequest.state+","+contract.obligations.oAgreedOnRequest.name+", " + contractId;
             		contract.notified.message.push({name: 'contract.obligations.oAgreedOnRequest', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAgreedOnRequest,[contract.obligations.oAgreedOnRequest.creditor,contract.obligations.oAgreedOnRequest.debtor],contract.obligations.oAgreedOnRequest.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async violateObligation_oDeliver(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.oDeliver != null){
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
         	          	
         	                let controllers = contract.obligations.oDeliver._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.oDeliver, roleObj, contract.obligations.oDeliver.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.oDeliver, roleObj, contract.obligations.oDeliver.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
         	            let transitionState = contract.obligations.oDeliver.state;
           	if (contract.obligations.oDeliver.violated()) {      
             		await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))        
             		//notify
             		let MSG= transitionState+" Changed to "+contract.obligations.oDeliver.state+","+contract.obligations.oDeliver.name+", " + contractId;
             		contract.notified.message.push({name: 'contract.obligations.oDeliver', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oDeliver,[contract.obligations.oDeliver.creditor,contract.obligations.oDeliver.debtor],contract.obligations.oDeliver.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async violateObligation_oAssign(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.oAssign != null){
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
         	          	
         	                let controllers = contract.obligations.oAssign._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.oAssign, roleObj, contract.obligations.oAssign.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.oAssign, roleObj, contract.obligations.oAssign.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
         	            let transitionState = contract.obligations.oAssign.state;
           	if (contract.obligations.oAssign.violated()) {      
             		await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))        
             		//notify
             		let MSG= transitionState+" Changed to "+contract.obligations.oAssign.state+","+contract.obligations.oAssign.name+", " + contractId;
             		contract.notified.message.push({name: 'contract.obligations.oAssign', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAssign,[contract.obligations.oAssign.creditor,contract.obligations.oAssign.debtor],contract.obligations.oAssign.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async violateObligation_oRequestVaccineDosage(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.oRequestVaccineDosage != null){
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
         	          	
         	                let controllers = contract.obligations.oRequestVaccineDosage._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.oRequestVaccineDosage, roleObj, contract.obligations.oRequestVaccineDosage.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.oRequestVaccineDosage, roleObj, contract.obligations.oRequestVaccineDosage.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
         	            let transitionState = contract.obligations.oRequestVaccineDosage.state;
           	if (contract.obligations.oRequestVaccineDosage.violated()) {      
             		await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))        
             		//notify
             		let MSG= transitionState+" Changed to "+contract.obligations.oRequestVaccineDosage.state+","+contract.obligations.oRequestVaccineDosage.name+", " + contractId;
             		contract.notified.message.push({name: 'contract.obligations.oRequestVaccineDosage', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oRequestVaccineDosage,[contract.obligations.oRequestVaccineDosage.creditor,contract.obligations.oRequestVaccineDosage.debtor],contract.obligations.oRequestVaccineDosage.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async violateSurvivingObligations_oPay(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect() || contract.isSuccessfulTermination()) {
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
         	          	          	
         	          	                let controllers = contract.survivingObligations.oPay._controller
         	          	        
         	          	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.survivingObligations.oPay, roleObj, contract.survivingObligations.oPay.getController(controllers.length - 1)) || 
         	          	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.survivingObligations.oPay, roleObj, contract.survivingObligations.oPay.getController(controllers.length - 1))) ){
         	          	                    throw new Error(`access denied...`)
         	          	                  }
         	let transitionState = contract.survivingObligations.oPay.state;
           if (contract.survivingObligations.oPay != null && contract.survivingObligations.oPay.violated()) { 
          		//notify
          		let MSG= transitionState+" Changed to "+contract.survivingObligations.oPay.state+","+contract.survivingObligations.oPay.name+", " + contractId;
          		contract.notified.message.push({name: 'contract.survivingObligations.oPay', message: MSG, roles:contract.accessPolicy.permissionValid(contract.survivingObligations.oPay,[contract.survivingObligations.oPay.creditor,contract.survivingObligations.oPay.debtor],contract.survivingObligations.oPay.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async violateSurvivingObligations_oWithdrewApproval(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	    	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect() || contract.isSuccessfulTermination()) {
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
         	          	          	
         	          	                let controllers = contract.survivingObligations.oWithdrewApproval._controller
         	          	        
         	          	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.survivingObligations.oWithdrewApproval, roleObj, contract.survivingObligations.oWithdrewApproval.getController(controllers.length - 1)) || 
         	          	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.survivingObligations.oWithdrewApproval, roleObj, contract.survivingObligations.oWithdrewApproval.getController(controllers.length - 1))) ){
         	          	                    throw new Error(`access denied...`)
         	          	                  }
         	let transitionState = contract.survivingObligations.oWithdrewApproval.state;
           if (contract.survivingObligations.oWithdrewApproval != null && contract.survivingObligations.oWithdrewApproval.violated()) { 
          		//notify
          		let MSG= transitionState+" Changed to "+contract.survivingObligations.oWithdrewApproval.state+","+contract.survivingObligations.oWithdrewApproval.name+", " + contractId;
          		contract.notified.message.push({name: 'contract.survivingObligations.oWithdrewApproval', message: MSG, roles:contract.accessPolicy.permissionValid(contract.survivingObligations.oWithdrewApproval,[contract.survivingObligations.oWithdrewApproval.creditor,contract.survivingObligations.oWithdrewApproval.debtor],contract.survivingObligations.oWithdrewApproval.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async expireObligation_oAgreedOnRequest(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.oAgreedOnRequest != null){
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
             	          	
             	                let controllers = contract.obligations.oAgreedOnRequest._controller
       				  	        
       				  	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.oAgreedOnRequest, roleObj, contract.obligations.oAgreedOnRequest.getController(controllers.length - 1)) || 
       				  	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.oAgreedOnRequest, roleObj, contract.obligations.oAgreedOnRequest.getController(controllers.length - 1))) ){
       				  	                    throw new Error(`access denied...`)
       				  	                  }
       				let transitionState = contract.obligations.oAgreedOnRequest.state;
           	
           	if (contract.obligations.oAgreedOnRequest.expired()) {         
              		//notify
              		let MSG= transitionState+" Changed to "+contract.obligations.oAgreedOnRequest.state+","+contract.obligations.oAgreedOnRequest.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.obligations.oAgreedOnRequest', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAgreedOnRequest,[contract.obligations.oAgreedOnRequest.creditor,contract.obligations.oAgreedOnRequest.debtor],contract.obligations.oAgreedOnRequest.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async expireObligation_oDeliver(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.oDeliver != null){
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
             	          	
             	                let controllers = contract.obligations.oDeliver._controller
       				  	        
       				  	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.oDeliver, roleObj, contract.obligations.oDeliver.getController(controllers.length - 1)) || 
       				  	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.oDeliver, roleObj, contract.obligations.oDeliver.getController(controllers.length - 1))) ){
       				  	                    throw new Error(`access denied...`)
       				  	                  }
       				let transitionState = contract.obligations.oDeliver.state;
           	
           	if (contract.obligations.oDeliver.expired()) {         
              		//notify
              		let MSG= transitionState+" Changed to "+contract.obligations.oDeliver.state+","+contract.obligations.oDeliver.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.obligations.oDeliver', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oDeliver,[contract.obligations.oDeliver.creditor,contract.obligations.oDeliver.debtor],contract.obligations.oDeliver.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async expireObligation_oAssign(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect()) {
           if (contract.obligations.oAssign != null){
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
             	          	
             	                let controllers = contract.obligations.oAssign._controller
       				  	        
       				  	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.obligations.oAssign, roleObj, contract.obligations.oAssign.getController(controllers.length - 1)) || 
       				  	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.obligations.oAssign, roleObj, contract.obligations.oAssign.getController(controllers.length - 1))) ){
       				  	                    throw new Error(`access denied...`)
       				  	                  }
       				let transitionState = contract.obligations.oAssign.state;
           	
           	if (contract.obligations.oAssign.expired()) {         
              		//notify
              		let MSG= transitionState+" Changed to "+contract.obligations.oAssign.state+","+contract.obligations.oAssign.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.obligations.oAssign', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAssign,[contract.obligations.oAssign.creditor,contract.obligations.oAssign.debtor],contract.obligations.oAssign.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async expireSurvivingObligation_oPay(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect() || contract.isSuccessfulTermination()) {
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
         	          	          	
         	          	                let controllers = contract.survivingObligations.oPay._controller
         	          	        
         	          	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.survivingObligations.oPay, roleObj, contract.survivingObligations.oPay.getController(controllers.length - 1)) || 
         	          	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.survivingObligations.oPay, roleObj, contract.survivingObligations.oPay.getController(controllers.length - 1))) ){
         	          	                    throw new Error(`access denied...`)
         	          	                  }
           if (contract.survivingObligations.oPay != null && contract.survivingObligations.oPay.expired()) {      
             await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
             return {successful: true}
           } else {
             return {successful: false}
           }
         } else {
           return {successful: false}
         }
       }
       
       async expireSurvivingObligation_oWithdrewApproval(ctx, contractId) {
       	const cid = new ClientIdentity(ctx.stub);
       	let roleObj;
         const contractState = await ctx.stub.getState(contractId)
         if (contractState == null) {
           return {successful: false}
         }
         const contract = deserialize(contractState.toString())
         this.initialize(contract)
       
         if (contract.isInEffect() || contract.isSuccessfulTermination()) {
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
         	          	          	
         	          	                let controllers = contract.survivingObligations.oWithdrewApproval._controller
         	          	        
         	          	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.survivingObligations.oWithdrewApproval, roleObj, contract.survivingObligations.oWithdrewApproval.getController(controllers.length - 1)) || 
         	          	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.survivingObligations.oWithdrewApproval, roleObj, contract.survivingObligations.oWithdrewApproval.getController(controllers.length - 1))) ){
         	          	                    throw new Error(`access denied...`)
         	          	                  }
           if (contract.survivingObligations.oWithdrewApproval != null && contract.survivingObligations.oWithdrewApproval.expired()) {      
             await ctx.stub.putState(contractId, Buffer.from(serialize(contract)))
             return {successful: true}
           } else {
             return {successful: false}
           }
         } else {
           return {successful: false}
         }
       }
       
       async expirePower_pStopWork(ctx, contractId) {
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
         	          	
         	         let controllers = contract.powers.pStopWork._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.pStopWork, roleObj, contract.powers.pStopWork.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.pStopWork, roleObj, contract.powers.pStopWork.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
       			let transitionState = contract.powers.pStopWork.state;
           if (contract.powers.pStopWork.expired()) {   
              		//notify
              		let MSG= transitionState+" Changed to "+contract.powers.pStopWork.state+","+contract.powers.pStopWork.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.powers.pStopWork', message: MSG, roles:contract.accessPolicy.permissionValid(contract.powers.pStopWork,[contract.powers.pStopWork.creditor,contract.powers.pStopWork.debtor],contract.powers.pStopWork.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
       
       async expirePower_pTermination(ctx, contractId) {
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
         	          	
         	         let controllers = contract.powers.pTermination._controller
         	        
         	        if(!contract.accessPolicy.hasPermesstion('grant','read', contract.powers.pTermination, roleObj, contract.powers.pTermination.getController(controllers.length - 1)) || 
         	                  !contract.accessPolicy.isValid(new Rule('grant','read', contract.powers.pTermination, roleObj, contract.powers.pTermination.getController(controllers.length - 1))) ){
         	                    throw new Error(`access denied...`)
         	                  }
       			let transitionState = contract.powers.pTermination.state;
           if (contract.powers.pTermination.expired()) {   
              		//notify
              		let MSG= transitionState+" Changed to "+contract.powers.pTermination.state+","+contract.powers.pTermination.name+", " + contractId;
              		contract.notified.message.push({name: 'contract.powers.pTermination', message: MSG, roles:contract.accessPolicy.permissionValid(contract.powers.pTermination,[contract.powers.pTermination.creditor,contract.powers.pTermination.debtor],contract.powers.pTermination.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
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
                'temperature', 'humidity', 'shock', 'lightExposure', 'sealOpen'
              ];
              
             for (const key of eventList) {
             
               // skip undefined contract entries
               if (contract[key] === undefined) continue;
               if (!contract.hasOwnProperty(key)) continue;
             
               const dObj = contract[key];
             
               rules.rules.push({
                 id: dObj._name + "Rule",
                 contractId: contractId,
                 chaincodeName: "vaccineprocurementsharedparty",
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
         if (contract.requested._triggered) {
           output += `  Event "requested" happened at ${contract.requested._timestamp}\r\n`
         } else {
           output += `  Event "requested" has not happened\r\n`
         }
         if (contract.leadtimeINform._triggered) {
           output += `  Event "leadtimeINform" happened at ${contract.leadtimeINform._timestamp}\r\n`
         } else {
           output += `  Event "leadtimeINform" has not happened\r\n`
         }
         if (contract.notifiedOD._triggered) {
           output += `  Event "notifiedOD" happened at ${contract.notifiedOD._timestamp}\r\n`
         } else {
           output += `  Event "notifiedOD" has not happened\r\n`
         }
         if (contract.delivered._triggered) {
           output += `  Event "delivered" happened at ${contract.delivered._timestamp}\r\n`
         } else {
           output += `  Event "delivered" has not happened\r\n`
         }
         if (contract.invoiced._triggered) {
           output += `  Event "invoiced" happened at ${contract.invoiced._timestamp}\r\n`
         } else {
           output += `  Event "invoiced" has not happened\r\n`
         }
         if (contract.paid._triggered) {
           output += `  Event "paid" happened at ${contract.paid._timestamp}\r\n`
         } else {
           output += `  Event "paid" has not happened\r\n`
         }
         if (contract.confirmed._triggered) {
           output += `  Event "confirmed" happened at ${contract.confirmed._timestamp}\r\n`
         } else {
           output += `  Event "confirmed" has not happened\r\n`
         }
         if (contract.lawStopWork._triggered) {
           output += `  Event "lawStopWork" happened at ${contract.lawStopWork._timestamp}\r\n`
         } else {
           output += `  Event "lawStopWork" has not happened\r\n`
         }
         if (contract.regulationStopWork._triggered) {
           output += `  Event "regulationStopWork" happened at ${contract.regulationStopWork._timestamp}\r\n`
         } else {
           output += `  Event "regulationStopWork" has not happened\r\n`
         }
         if (contract.judicialStopWork._triggered) {
           output += `  Event "judicialStopWork" happened at ${contract.judicialStopWork._timestamp}\r\n`
         } else {
           output += `  Event "judicialStopWork" has not happened\r\n`
         }
         if (contract.adminStopWork._triggered) {
           output += `  Event "adminStopWork" happened at ${contract.adminStopWork._timestamp}\r\n`
         } else {
           output += `  Event "adminStopWork" has not happened\r\n`
         }
         if (contract.govStopWork._triggered) {
           output += `  Event "govStopWork" happened at ${contract.govStopWork._timestamp}\r\n`
         } else {
           output += `  Event "govStopWork" has not happened\r\n`
         }
         if (contract.agreedFromG._triggered) {
           output += `  Event "agreedFromG" happened at ${contract.agreedFromG._timestamp}\r\n`
         } else {
           output += `  Event "agreedFromG" has not happened\r\n`
         }
         if (contract.outsideRisk._triggered) {
           output += `  Event "outsideRisk" happened at ${contract.outsideRisk._timestamp}\r\n`
         } else {
           output += `  Event "outsideRisk" has not happened\r\n`
         }
         if (contract.withdrewApproval._triggered) {
           output += `  Event "withdrewApproval" happened at ${contract.withdrewApproval._timestamp}\r\n`
         } else {
           output += `  Event "withdrewApproval" has not happened\r\n`
         }
         if (contract.buyerTerminateAgreement._triggered) {
           output += `  Event "buyerTerminateAgreement" happened at ${contract.buyerTerminateAgreement._timestamp}\r\n`
         } else {
           output += `  Event "buyerTerminateAgreement" has not happened\r\n`
         }
         if (contract.pfizerTerminateAgreement._triggered) {
           output += `  Event "pfizerTerminateAgreement" happened at ${contract.pfizerTerminateAgreement._timestamp}\r\n`
         } else {
           output += `  Event "pfizerTerminateAgreement" has not happened\r\n`
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
         if (contract.shock._triggered) {
           output += `  Event "shock" happened at ${contract.shock._timestamp}\r\n`
         } else {
           output += `  Event "shock" has not happened\r\n`
         }
         if (contract.lightExposure._triggered) {
           output += `  Event "lightExposure" happened at ${contract.lightExposure._timestamp}\r\n`
         } else {
           output += `  Event "lightExposure" has not happened\r\n`
         }
         if (contract.sealOpen._triggered) {
           output += `  Event "sealOpen" happened at ${contract.sealOpen._timestamp}\r\n`
         } else {
           output += `  Event "sealOpen" has not happened\r\n`
         }
         
         return output
       }
     }
     
     module.exports.contracts = [HFContract];
