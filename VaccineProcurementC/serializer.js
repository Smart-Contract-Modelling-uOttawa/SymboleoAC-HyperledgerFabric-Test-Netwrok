   //Flat library to solve the circular problem when stringifying node objects
   const {stringify, parse } = require('flatted')
   const { VaccineProcurementC } = require("./domain/contract/VaccineProcurementC.js")
   const { Obligation, ObligationActiveState, ObligationState } = require("symboleoac-js-core")
   const { InternalEventType, InternalEvent, InternalEventSource} = require("symboleoac-js-core")
   const { Event } = require("symboleoac-js-core")
   const { Power } = require("symboleoac-js-core")
   const { ACPolicy } = require("symboleoac-js-core")
   const { DataTransfer } = require("symboleoac-js-core")
     
   let contract = null
   
   function deserialize(data) {
      let object = parse(data,reviver);
     // to update all the assign variable with the new value. We check the type of the variable before assiging the new value
     contract = new VaccineProcurementC(object.pfizerP,object.mcdcP,object.regulatorP,object.adminP,object.fdaP,object.worldcourierP,object.approval,object.unitPrice,object.minQuantity,object.maxQuantity)
   contract.state = object.state
   contract.activeState = object.activeState
     
   // Add roles to role list
   for(obj of object._roles){
     contract.addRole(obj)
   }
   
   // Remove roles that were removed at runtime as initiating the contract genrates the same roles at design time
   let toRemoveRole = []
   for (let i = 0; i < contract._roles.length; i++) {
      let isRole = false
    
      if (contract._roles[i] !== undefined) {
      isRole = object._roles.some(obj => obj._name === contract._roles[i]._name && obj._type === contract._roles[i]._type)
   }
  
   if (!isRole) {
      toRemoveRole.push(contract._roles[i])
     }
   }

   contract._roles = contract._roles.filter(
     item => !toRemoveRole.some(
       other => other._name === item._name && other._type === item._type
     )
   );

   //AC for genrtaing certificate for each user, use name as an enrollment ID
   contract.userList = object.userList

   //AC- acpolicy
   const ac = new ACPolicy()
  
   //ac = object.accessPolicy
   contract.accessPolicy = ac  

   //return all objects 
   for (const key of Object.keys(object)) {
  
      if(key !== 'obligations' && key !== 'powers'){
     
        if (typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
        
          for(const eKey of Object.keys(object[key])) {
          	if(typeof  object[key][eKey] === 'object' &&  object[key][eKey] !== null){
          		if(object[key][eKey]._type === 'Attribute'){
             		contract[key][eKey]._value = object[key][eKey]._value
          	  }else{
           	//if it is a list but it is not controller, bring it back
           	const x = object[key][eKey]
           	if(eKey !== '_controller'){
                	if(contract[object[key][eKey]._name] !=  undefined){ 
                 		if(contract[x._name]._type === x._type){
   
                   		contract[key][eKey] =  contract[x._name]
     
                 		}else{//return objects that does not have type
                 		
                   		if(contract[key][eKey] !=  undefined){
                   		      contract[key][eKey] = object[key][eKey]
                   		}
                 		}
                                 
               }else{//return objects that does not have name 
                 if(contract[key] !=  undefined){
                                 contract[key][eKey] = object[key][eKey]
                               }
               }
               
             }
           }
            
           }else{//string/numerical and so on 
             if(contract[key] !=  undefined){
                           contract[key][eKey] = object[key][eKey]
                 }
             }
          }//nested for
        }
      }
   }
    

   contract.accessPolicy._rules = object.accessPolicy._rules
   // internal events (violated, suspended, ..)     
     for (const eventType of Object.keys(InternalEventType.contract)) {
       if (object._events[eventType] != null) {
         const eventObject = new Event()
         eventObject._triggered = object._events[eventType]._triggered
         eventObject._timestamp = object._events[eventType]._timestamp
         contract._events[eventType] = eventObject
       }
     }

   if (object.obligations.oAgreedOnRequest != null) {
       const obligation = new Obligation('oAgreedOnRequest', contract.pfizer, contract.mcdc, contract)
       obligation.state = object.obligations.oAgreedOnRequest.state
       obligation.activeState = object.obligations.oAgreedOnRequest.activeState
       obligation.consequent = object.obligations.oAgreedOnRequest.consequent
       obligation.antecedent = object.obligations.oAgreedOnRequest.antecedent
       obligation._createdPowerNames = object.obligations.oAgreedOnRequest._createdPowerNames
       obligation._suspendedByContractSuspension = object.obligations.oAgreedOnRequest._suspendedByContractSuspension
       for (const eventType of Object.keys(InternalEventType.obligation)) {
         if (object.obligations.oAgreedOnRequest._events[eventType] != null) {
           const eventObject = new Event()
           eventObject._triggered = object.obligations.oAgreedOnRequest._events[eventType]._triggered
           eventObject._timestamp = object.obligations.oAgreedOnRequest._events[eventType]._timestamp
           obligation._events[eventType] = eventObject
         }
       }
       contract.obligations.oAgreedOnRequest = obligation
   }
   if (object.obligations.oDeliver != null) {
       const obligation = new Obligation('oDeliver', contract.mcdc, contract.pfizer, contract)
       obligation.state = object.obligations.oDeliver.state
       obligation.activeState = object.obligations.oDeliver.activeState
       obligation.consequent = object.obligations.oDeliver.consequent
       obligation.antecedent = object.obligations.oDeliver.antecedent
       obligation._createdPowerNames = object.obligations.oDeliver._createdPowerNames
       obligation._suspendedByContractSuspension = object.obligations.oDeliver._suspendedByContractSuspension
       for (const eventType of Object.keys(InternalEventType.obligation)) {
         if (object.obligations.oDeliver._events[eventType] != null) {
           const eventObject = new Event()
           eventObject._triggered = object.obligations.oDeliver._events[eventType]._triggered
           eventObject._timestamp = object.obligations.oDeliver._events[eventType]._timestamp
           obligation._events[eventType] = eventObject
         }
       }
       contract.obligations.oDeliver = obligation
   }
   if (object.obligations.oAssign != null) {
       const obligation = new Obligation('oAssign', contract.pfizer, contract.mcdc, contract)
       obligation.state = object.obligations.oAssign.state
       obligation.activeState = object.obligations.oAssign.activeState
       obligation.consequent = object.obligations.oAssign.consequent
       obligation.antecedent = object.obligations.oAssign.antecedent
       obligation._createdPowerNames = object.obligations.oAssign._createdPowerNames
       obligation._suspendedByContractSuspension = object.obligations.oAssign._suspendedByContractSuspension
       for (const eventType of Object.keys(InternalEventType.obligation)) {
         if (object.obligations.oAssign._events[eventType] != null) {
           const eventObject = new Event()
           eventObject._triggered = object.obligations.oAssign._events[eventType]._triggered
           eventObject._timestamp = object.obligations.oAssign._events[eventType]._timestamp
           obligation._events[eventType] = eventObject
         }
       }
       contract.obligations.oAssign = obligation
   }
   if (object.obligations.oRequestVaccineDosage != null) {
       const obligation = new Obligation('oRequestVaccineDosage', contract.pfizer, contract.mcdc, contract)
       obligation.state = object.obligations.oRequestVaccineDosage.state
       obligation.activeState = object.obligations.oRequestVaccineDosage.activeState
       obligation.consequent = object.obligations.oRequestVaccineDosage.consequent
       obligation.antecedent = object.obligations.oRequestVaccineDosage.antecedent
       obligation._createdPowerNames = object.obligations.oRequestVaccineDosage._createdPowerNames
       obligation._suspendedByContractSuspension = object.obligations.oRequestVaccineDosage._suspendedByContractSuspension
       for (const eventType of Object.keys(InternalEventType.obligation)) {
         if (object.obligations.oRequestVaccineDosage._events[eventType] != null) {
           const eventObject = new Event()
           eventObject._triggered = object.obligations.oRequestVaccineDosage._events[eventType]._triggered
           eventObject._timestamp = object.obligations.oRequestVaccineDosage._events[eventType]._timestamp
           obligation._events[eventType] = eventObject
         }
       }
       contract.obligations.oRequestVaccineDosage = obligation
   }
   
     if (object.survivingObligations.oPay != null) {
       const obligation = new Obligation('oPay', contract.pfizer, contract.mcdc, contract,null, true)
       obligation.state = object.survivingObligations.oPay.state
       obligation.activeState = object.survivingObligations.oPay.activeState
       obligation._createdPowerNames = object.survivingObligations.oPay._createdPowerNames
       obligation._suspendedByContractSuspension = object.survivingObligations.oPay._suspendedByContractSuspension
       for (const eventType of Object.keys(InternalEventType.obligation)) {
         if (object.survivingObligations.oPay._events[eventType] != null) {
           const eventObject = new Event()
           eventObject._triggered = object.survivingObligations.oPay._events[eventType]._triggered
           eventObject._timestamp = object.survivingObligations.oPay._events[eventType]._timestamp
           obligation._events[eventType] = eventObject
         }
       }
       contract.survivingObligations.oPay = obligation
     }
     if (object.survivingObligations.oWithdrewApproval != null) {
       const obligation = new Obligation('oWithdrewApproval', contract.mcdc, contract.pfizer, contract,null, true)
       obligation.state = object.survivingObligations.oWithdrewApproval.state
       obligation.activeState = object.survivingObligations.oWithdrewApproval.activeState
       obligation._createdPowerNames = object.survivingObligations.oWithdrewApproval._createdPowerNames
       obligation._suspendedByContractSuspension = object.survivingObligations.oWithdrewApproval._suspendedByContractSuspension
       for (const eventType of Object.keys(InternalEventType.obligation)) {
         if (object.survivingObligations.oWithdrewApproval._events[eventType] != null) {
           const eventObject = new Event()
           eventObject._triggered = object.survivingObligations.oWithdrewApproval._events[eventType]._triggered
           eventObject._timestamp = object.survivingObligations.oWithdrewApproval._events[eventType]._timestamp
           obligation._events[eventType] = eventObject
         }
       }
       contract.survivingObligations.oWithdrewApproval = obligation
     }
     
     if (object.powers.pStopWork != null) {
       const power = new Power('pStopWork', contract.mcdc, contract.mcdc, contract)
       power.state = object.powers.pStopWork.state
       power.activeState = object.powers.pStopWork.activeState
       power.consequent = object.powers.pStopWork.consequent
       power.antecedent = object.powers.pStopWork.antecedent
       for (const eventType of Object.keys(InternalEventType.power)) {
         if (object.powers.pStopWork._events[eventType] != null) {
           const eventObject = new Event()
           eventObject._triggered = object.powers.pStopWork._events[eventType]._triggered
           eventObject._timestamp = object.powers.pStopWork._events[eventType]._timestamp
           power._events[eventType] = eventObject
         }
       }
       contract.powers.pStopWork = power
     }
     if (object.powers.pTermination != null) {
       const power = new Power('pTermination', contract.pfizer, contract.pfizer, contract)
       power.state = object.powers.pTermination.state
       power.activeState = object.powers.pTermination.activeState
       power.consequent = object.powers.pTermination.consequent
       power.antecedent = object.powers.pTermination.antecedent
       for (const eventType of Object.keys(InternalEventType.power)) {
         if (object.powers.pTermination._events[eventType] != null) {
           const eventObject = new Event()
           eventObject._triggered = object.powers.pTermination._events[eventType]._triggered
           eventObject._timestamp = object.powers.pTermination._events[eventType]._timestamp
           power._events[eventType] = eventObject
         }
       }
       contract.powers.pTermination = power
     }
   const contractList=['regulator','admin','pfizer','mcdc','fda','worldcourier','requested','leadtimeINform','notifiedOD','delivered','invoiced','paid','confirmed','lawStopWork','regulationStopWork','judicialStopWork','adminStopWork','govStopWork','vaccineDose','agreedFromG','outsideRisk','remain','paidAmount','withdrewApproval','mcdcTerminateAgreement','pfizerTerminateAgreement','temperature','humidity','shock','lightExposure','sealOpen','accessPolicy']  
   for (const key of contractList) {
               if(object[key] === 'undefined'){
                  continue
                 }else{
           
                   contract[key]._controller = []
                   for(const valuet of object[key]._controller) {
                     contract[key].addController(reviverList(valuet)) 
                
                   }//for Event
                   if(contract[key] instanceof Event || (contract[key] instanceof DataTransfer)){
                     contract[key]._performer = []
                     for(const valuet of object[key]._performer) {
                     	contract[key].addPerformer(reviverList(valuet)) 
                     }
           
                   }
                    //retrive and add controller to attributes 
                    
                    for (const eKey of Object.keys(object[key])) { 
                          let attr = object[key][eKey]
                          if(typeof attr === 'object' && attr !== null){
                          if(attr._type === 'Attribute'){
                            contract[key][eKey]._controller = []
                             for(const valuet of object[key][eKey]._controller) {
                             contract[key][eKey].addController(reviverList(valuet)) 
                           }
                         }
           
                         }
           
                 }
           
                 }
         }  
  //retrive all obligation and add controllers, performers and so on
  for (const key of Object.keys(contract.obligations)){
          contract.obligations[key]._controller = []
          for(const valuet of object.obligations[key]._controller) {
            contract.obligations[key].addController(reviverList(valuet)) 
           }
            contract.obligations[key]._performer = []
            for(const valuet of object.obligations[key]._performer) {
              contract.obligations[key].addPerformer(reviverList(valuet)) 
            }
            
            contract.obligations[key]._rightHolder = []
            for(const valuet of object.obligations[key]._rightHolder) {
              contract.obligations[key].addRightHolder(reviverList(valuet)) 
            }
  
            contract.obligations[key]._liable = []
            for(const valuet of object.obligations[key]._liable) {
              contract.obligations[key].addLiable(reviverList(valuet)) 
            }
  
      
  }
  //power
  //retrive all power and add controllers, performers and so on
  for (const key of Object.keys(contract.powers)){
    contract.powers[key]._controller = []
    for(const valuet of object.powers[key]._controller) {
      contract.powers[key].addController(reviverList(valuet)) 
    }
      contract.powers[key]._performer = []
      for(const valuet of object.powers[key]._performer) {
        contract.powers[key].addPerformer(reviverList(valuet)) 
      }
      
      contract.powers[key]._rightHolder = []
      for(const valuet of object.powers[key]._rightHolder) {
        contract.powers[key].addRightHolder(reviverList(valuet)) 
      }
  
      contract.powers[key]._liable = []
      for(const valuet of object.powers[key]._liable) {
        contract.powers[key].addLiable(reviverList(valuet)) 
      }
  
  }
  
     //add controller to contract 
     contract._controller = []
     for(obj of object._controller){
      contract.addController(reviverList(obj)) 
    }
  
    //retrive all rules of all resourcers 
    contract.accessPolicy._rules = []
      for (let i = 0; i < object.accessPolicy._rules.length; i++) {
       
      let obj = object.accessPolicy._rules[i].accessedResource
      let accessedResource = obj
          //retrive rules of obligation and power
      if(object.accessPolicy._rules[i].accessedResource._type.toLowerCase() === 'obligation' || object.accessPolicy._rules[i].accessedResource._type.toLowerCase() === 'power'){
         accessedResource = contract.findLegalPosition(obj.name, obj._type, contract)
      }else{//worked and retrive rules for all resources acccept resources.attribute is in the else
          if(contract[obj._name] != undefined){
           accessedResource = contract[obj._name]
        }else{
           accessedResource = contract[obj._parent][obj._name]
         
        }
      }
      //retrive accessedRole
      obj = object.accessPolicy._rules[i].accessedRole
      let accessedRole=obj
      if(obj != undefined){
         accessedRole = reviverList(obj)
      }
      //retrive byRole
      obj = object.accessPolicy._rules[i].byRole
      let byRole =  obj
      if(obj != undefined){
        byRole =  reviverList(obj)
      }
  
        contract.accessPolicy.addRulee(object.accessPolicy._rules[i].decision,object.accessPolicy._rules[i].permission, accessedResource, accessedRole, byRole)//worked, added to rules
    }
   
     
     return contract
   }
   // to stringify the contract
   function replacer(key, value) {   
     if (value === undefined) {     
        return "<undefined>";   }   
      return value;
    }
   // return roles' objects from contract that are equavelent to the roles' objects in the object after parsing contract data (let object = parse(data,reviver)) 
   function reviverList(aController) {  
 
   if(aController._name !== undefined && aController._name !== 'undefined' && aController !== null  &&  aController !== undefined){
     return contract.getRole(aController._name, aController._type)
   }else{
     return null
   }
   
 }
   // used in pars function to unify the undefined values  
   function reviver(key, value) {   
     if (value === "<undefined>") {     
       return undefined;   
     }
        return value; 
       }
 
 function serialize(contract) {
   for (const key of Object.keys(contract.obligations)){
     contract.obligations[key].contract = undefined
   }
 
   for (const key of Object.keys(contract.powers)){
     contract.powers[key].contract = undefined
   }
 
   for (const key of Object.keys(contract.survivingObligations)){
     contract.survivingObligations[key].contract = undefined
   }
  
   return stringify(contract, replacer, 2); // instead of stringify(contract, null, 2) to solve circular issue when pars the contract
  
 }
 
 module.exports.deserialize = deserialize
 module.exports.serialize = serialize
