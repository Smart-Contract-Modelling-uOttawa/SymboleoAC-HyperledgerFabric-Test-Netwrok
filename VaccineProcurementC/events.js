const { LegalSituation, InternalEventSource, InternalEvent, InternalEventType } = require("symboleoac-js-core")
const { Obligation } = require("symboleoac-js-core")
const { Power } = require("symboleoac-js-core")
const { Predicates } = require("symboleoac-js-core")
const { Utils } = require("symboleoac-js-core")
const { Str } = require("symboleoac-js-core")
const { Location } = require("./domain/types/Location.js")
const { ACPolicy } = require("symboleoac-js-core")
const { Resource } = require("symboleoac-js-core")

const EventListeners = {
  createObligation_oDeliver(contract) {
    if (Predicates.happens(contract.requested) ) { 
      if (contract.obligations.oDeliver == null || contract.obligations.oDeliver.isFinished()) {
        const isNewInstance =  contract.obligations.oDeliver != null && contract.obligations.oDeliver.isFinished()
        contract.oDeliverSituation = new LegalSituation();

contract.oDeliverSituation.addConsequentOf({_type: 'eventCondition', resource:"notifiedOD", resourceType:"NotifiedOfDelivery"})
 
contract.oDeliverSituation.addConsequentOf({_type: 'eventCondition', resource:"delivered", resourceType:"Delivered"} )
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.delivered.delAddr._value', op:'===', rightSide: 'contract.confirmed.shipToLocation._value', _type: 'Condition'})
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.vaccineDose.FDAapproval._value', op:'===', rightSide: 'true', _type: 'Condition'})
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.delivered.reqID._value', op:'===', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.notifiedOD.reqID._value', op:'===', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.confirmed.reqID._value', op:'===', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.delivered.date._value', op:'===', rightSide: 'contract.notifiedOD.delD._value', _type: 'Condition'})
 
contract.oDeliverSituation.addConsequentOf({_type: 'eventCondition', resource:"outsideRisk", resourceType:"Risk"} )
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.delivered.date._value', op:'===', rightSide: 'contract.outsideRisk.extendedDel._value', _type: 'Condition'})
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.requested.reqID._value', op:'===', rightSide: 'contract.outsideRisk.reqID._value', _type: 'Condition'})
 
contract.oDeliverSituation.addConsequentOf({_type: 'eventCondition', resource:"temperature", resourceType:"Alert"} )
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.temperature.reqID._value', op:'!==', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
 
contract.oDeliverSituation.addConsequentOf({_type: 'eventCondition', resource:"sealOpen", resourceType:"Alert"} )
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.sealOpen.reqID._value', op:'!==', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
 
contract.oDeliverSituation.addConsequentOf({_type: 'eventCondition', resource:"humidity", resourceType:"Alert"} )
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.humidity.reqID._value', op:'!==', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
 
contract.oDeliverSituation.addConsequentOf({_type: 'eventCondition', resource:"shock", resourceType:"Alert"} )
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.shock.reqID._value', op:'!==', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
 
contract.oDeliverSituation.addConsequentOf({_type: 'eventCondition', resource:"lightExposure", resourceType:"Alert"} )
 contract.oDeliverSituation.addConsequentOf({ leftSide:'contract.lightExposure.reqID._value', op:'!==', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
        
        contract.oDeliverSituation.addAntecedentOf( {_type: 'stateCondition', resourceType:"obligation", resource: "oAgreedOnRequest", state:"fulfillment"} )
         
        contract.oDeliverSituation.addAntecedentOf({_type: 'eventCondition', resource:"confirmed", resourceType:"Confirmed"} )
         contract.obligations.oDeliver = new Obligation('oDeliver', contract.mcdc, contract.pfizer, contract, contract.oDeliverSituation)
         contract.obligations.oDeliver.addController(this.regulator)
        if (!isNewInstance  ) { 
          contract.obligations.oDeliver.trigerredUnconditional()
          let transitionState = contract.obligations.oDeliver.state;
          if (!isNewInstance && Predicates.strongHappensBefore(contract.notifiedOD, contract.confirmed._timestamp)  && Predicates.happens(contract.delivered)  && contract.delivered.delAddr._value===contract.confirmed.shipToLocation._value && contract.vaccineDose.FDAapproval._value===true && contract.delivered.reqID._value===contract.requested.reqID._value && contract.notifiedOD.reqID._value===contract.requested.reqID._value && contract.confirmed.reqID._value===contract.requested.reqID._value && ((contract.delivered.date._value===contract.notifiedOD.delD._value) || (Predicates.happens(contract.outsideRisk)  && contract.delivered.date._value===contract.outsideRisk.extendedDel._value && contract.requested.reqID._value===contract.outsideRisk.reqID._value)) && (!(Predicates.happens(contract.temperature) ) || contract.temperature.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.sealOpen) ) || contract.sealOpen.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.humidity) ) || contract.humidity.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.shock) ) || contract.shock.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.lightExposure) ) || contract.lightExposure.reqID._value!==contract.requested.reqID._value)) { 
            contract.obligations.oDeliver.fulfilled()
            let controllers = contract.obligations.oDeliver._controller
       		//notify
       		let MSG= transitionState+" Changed to "+contract.obligations.oDeliver.state+","+contract.obligations.oDeliver.name+", " + contract.obligations.oDeliver.contract.id;
       		contract.notified.message.push({name: 'contract.obligations.oDeliver', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oDeliver,[contract.obligations.oDeliver.creditor,contract.obligations.oDeliver.debtor],contract.obligations.oDeliver.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
          }
        } else {
          contract.obligations.oDeliver.trigerredConditional()
        }
      }
    }
  },
  createObligation_oAgreedOnRequest(contract) {
    if (Predicates.happens(contract.requested) ) { 
      if (contract.obligations.oAgreedOnRequest == null || contract.obligations.oAgreedOnRequest.isFinished()) {
        const isNewInstance =  contract.obligations.oAgreedOnRequest != null && contract.obligations.oAgreedOnRequest.isFinished()
        contract.oAgreedOnRequestSituation = new LegalSituation();

contract.oAgreedOnRequestSituation.addConsequentOf({_type: 'eventCondition', resource:"leadtimeINform", resourceType:"LeadtimeInformedNegotiated"})
 contract.oAgreedOnRequestSituation.addConsequentOf({ leftSide:'contract.leadtimeINform.reqID._value', op:'===', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
 contract.oAgreedOnRequestSituation.addConsequentOf({ leftSide:'contract.agreedFromG.reqID._value', op:'===', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
 contract.oAgreedOnRequestSituation.addConsequentOf({ leftSide:'contract.requested.dosage._value', op:'>=',  rightSide: 'contract.minQuantity', _type: 'Condition'}) 
 contract.oAgreedOnRequestSituation.addConsequentOf({ leftSide:'contract.requested.dosage._value', op:'<=',  rightSide: 'contract.remain.value._value', _type: 'Condition'}) 
        
        contract.oAgreedOnRequestSituation.addAntecedentOf({_type: 'eventCondition', resource:"agreedFromG", resourceType:"Agreed"} )
         contract.obligations.oAgreedOnRequest = new Obligation('oAgreedOnRequest', contract.pfizer, contract.mcdc, contract, contract.oAgreedOnRequestSituation)
        if (!isNewInstance  ) { 
          contract.obligations.oAgreedOnRequest.trigerredUnconditional()
          let transitionState = contract.obligations.oAgreedOnRequest.state;
          if (!isNewInstance && Predicates.strongHappensBefore(contract.leadtimeINform, contract.agreedFromG._timestamp)  && contract.leadtimeINform.reqID._value===contract.requested.reqID._value && contract.agreedFromG.reqID._value===contract.requested.reqID._value && (contract.requested.dosage._value >= contract.minQuantity && contract.requested.dosage._value <= contract.remain.value._value)) { 
            contract.obligations.oAgreedOnRequest.fulfilled()
            let controllers = contract.obligations.oAgreedOnRequest._controller
       		//notify
       		let MSG= transitionState+" Changed to "+contract.obligations.oAgreedOnRequest.state+","+contract.obligations.oAgreedOnRequest.name+", " + contract.obligations.oAgreedOnRequest.contract.id;
       		contract.notified.message.push({name: 'contract.obligations.oAgreedOnRequest', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAgreedOnRequest,[contract.obligations.oAgreedOnRequest.creditor,contract.obligations.oAgreedOnRequest.debtor],contract.obligations.oAgreedOnRequest.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
          }
        } else {
          contract.obligations.oAgreedOnRequest.trigerredConditional()
        }
      }
    }
  },
  createObligation_oAssign(contract) {
    if (Predicates.happens(contract.requested) ) { 
      if (contract.obligations.oAssign == null || contract.obligations.oAssign.isFinished()) {
        const isNewInstance =  contract.obligations.oAssign != null && contract.obligations.oAssign.isFinished()
        contract.oAssignSituation = new LegalSituation();

contract.oAssignSituation.addConsequentOf( {_type: 'stateCondition', resourceType:"obligation", resource: "oDeliver", state:"fulfillment"} )
 contract.oAssignSituation.addConsequentOf({ leftSide:'contract.delivered.reqID._value', op:'===', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
        
        contract.oAssignSituation.addAntecedentOf({_type: 'eventCondition', resource:"delivered", resourceType:"Delivered"} )
         contract.oAssignSituation.addAntecedentOf({ leftSide:'contract.delivered.reqID._value', op:'===', rightSide: 'contract.requested.reqID._value', _type: 'Condition'})
         contract.obligations.oAssign = new Obligation('oAssign', contract.pfizer, contract.mcdc, contract, contract.oAssignSituation)
        if (!isNewInstance  ) { 
          contract.obligations.oAssign.trigerredUnconditional()
          let transitionState = contract.obligations.oAssign.state;
          if (!isNewInstance && Predicates.happens(contract.obligations.oDeliver && contract.obligations.oDeliver._events.Fulfilled)  && contract.delivered.reqID._value===contract.requested.reqID._value) { 
           contract.remain.value._value = contract.remain.value._value - contract.delivered.dosage._value 
           contract.paidAmount.value._value = contract.delivered.dosage._value * contract.vaccineDose.price._value 
            contract.obligations.oAssign.fulfilled()
            let controllers = contract.obligations.oAssign._controller
       		//notify
       		let MSG= transitionState+" Changed to "+contract.obligations.oAssign.state+","+contract.obligations.oAssign.name+", " + contract.obligations.oAssign.contract.id;
       		contract.notified.message.push({name: 'contract.obligations.oAssign', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAssign,[contract.obligations.oAssign.creditor,contract.obligations.oAssign.debtor],contract.obligations.oAssign.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
          }
        } else {
          contract.obligations.oAssign.trigerredConditional()
        }
      }
    }
  },
  createSurvivingObligation_oPay(contract) {
    if (Predicates.happens(contract.requested) ) { 
      if (contract.survivingObligations.oPay == null || contract.survivingObligations.oPay.isFinished()) {
        contract.survivingObligations.oPay = new Obligation('oPay', contract.pfizer, contract.mcdc, contract,null, true)
        if (Predicates.happens(contract.invoiced)  && contract.vaccineDose.FDAapproval._value===true && contract.invoiced.reqID._value===contract.requested.reqID._value && Predicates.happens(contract.obligations.oDeliver && contract.obligations.oDeliver._events.Fulfilled)  && Predicates.strongHappensBefore(contract.delivered, contract.invoiced._timestamp)  && contract.delivered.reqID._value===contract.requested.reqID._value) { 
          contract.survivingObligations.oPay.trigerredUnconditional()
          //AC
          let transitionState = contract.survivingObligations.oPay.state;
           if ( !isNewInstance &&Predicates.happens(contract.invoiced)  && contract.vaccineDose.FDAapproval._value===true && contract.invoiced.reqID._value===contract.requested.reqID._value && Predicates.happens(contract.obligations.oDeliver && contract.obligations.oDeliver._events.Fulfilled)  && Predicates.strongHappensBefore(contract.delivered, contract.invoiced._timestamp)  && contract.delivered.reqID._value===contract.requested.reqID._value)
          if (Predicates.strongHappensBefore(contract.paid, Utils.addTime(contract.invoiced.date._value, 30, "days"))  && contract.invoiced.reqID._value===contract.requested.reqID._value && contract.invoiced.reqID._value===contract.paid.reqID._value && contract.paid.amount._value===contract.paidAmount.value._value ) { 
            contract.survivingObligations.oPay.fulfilled()
            //AC
            let controllers = contract.survivingObligations.oPay._controller
            //notify
             let MSG= transitionState+" Changed to "+contract.survivingObligations.oPay.state+","+contract.survivingObligations.oPay.name+", " + contract.survivingObligations.oPay.contract.id;
             contract.notified.message.push({name: 'contract.survivingObligations.oPay', message: MSG, roles:contract.accessPolicy.permissionValid(contract.survivingObligations.oPay,[contract.survivingObligations.oPay.creditor,contract.survivingObligations.oPay.debtor],contract.survivingObligations.oPay.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
            
          }
        } else {
          contract.survivingObligations.oPay.trigerredConditional()
        }
      }
    }
  },
  createPower_pTermination(contract) {
    const effects = { powerCreated: false }
    if (Predicates.happens(contract.obligations.oRequestVaccineDosage && contract.obligations.oRequestVaccineDosage._events.Fulfilled) ) { 
      if (contract.powers.pTermination == null || contract.powers.pTermination.isFinished()){
        const isNewInstance =  contract.powers.pTermination != null && contract.powers.pTermination.isFinished()
        contract.pTerminationSituation = new LegalSituation();            
        contract.pTerminationSituation.addConsequentOf({_type: 'stateCondition',resourceType: 'contract', resource: 'contract', state:'unsuccessfultermination'})
        contract.powers.pTermination = new Power('pTermination', contract.pfizer, contract.mcdc, contract, contract.pTerminationSituation)
        effects.powerCreated = true
        effects.powerName = 'pTermination'
        if (true ) { 
          contract.powers.pTermination.trigerredUnconditional()
        } else {
          contract.powers.pTermination.trigerredConditional()
        }
      }
    }
    return effects
  },
  createPower_pStopWork(contract) {
    const effects = { powerCreated: false }
    if (Predicates.happens(contract.lawStopWork)  || Predicates.happens(contract.adminStopWork)  || Predicates.happens(contract.regulationStopWork)  || Predicates.happens(contract.judicialStopWork) ) { 
      if (contract.powers.pStopWork == null || contract.powers.pStopWork.isFinished()){
        const isNewInstance =  contract.powers.pStopWork != null && contract.powers.pStopWork.isFinished()
        contract.pStopWorkSituation = new LegalSituation();            

contract.pStopWorkSituation.addAntecedentOf({_type: 'eventCondition', resource:"govStopWork", resourceType:"StopWork"} )
        contract.pStopWorkSituation.addConsequentOf({_type: 'stateCondition',resourceType: 'contract', resource: 'contract', state:'unsuccessfultermination'})
        contract.powers.pStopWork = new Power('pStopWork', contract.mcdc, contract.pfizer, contract, contract.pStopWorkSituation)
        effects.powerCreated = true
        effects.powerName = 'pStopWork'
        if (!isNewInstance && Predicates.happens(contract.govStopWork)  ) { 
          contract.powers.pStopWork.trigerredUnconditional()
        } else {
          contract.powers.pStopWork.trigerredConditional()
        }
      }
    }
    return effects
  },
  activateObligation_oDeliver(contract) {
    if (contract.obligations.oDeliver != null && (Predicates.happens(contract.obligations.oAgreedOnRequest && contract.obligations.oAgreedOnRequest._events.Fulfilled)  && Predicates.happens(contract.confirmed) )) { 
      contract.obligations.oDeliver.activated()
                    if (Predicates.strongHappensBefore(contract.notifiedOD, contract.confirmed._timestamp)  && Predicates.happens(contract.delivered)  && contract.delivered.delAddr._value===contract.confirmed.shipToLocation._value && contract.vaccineDose.FDAapproval._value===true && contract.delivered.reqID._value===contract.requested.reqID._value && contract.notifiedOD.reqID._value===contract.requested.reqID._value && contract.confirmed.reqID._value===contract.requested.reqID._value && ((contract.delivered.date._value===contract.notifiedOD.delD._value) || (Predicates.happens(contract.outsideRisk)  && contract.delivered.date._value===contract.outsideRisk.extendedDel._value && contract.requested.reqID._value===contract.outsideRisk.reqID._value)) && (!(Predicates.happens(contract.temperature) ) || contract.temperature.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.sealOpen) ) || contract.sealOpen.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.humidity) ) || contract.humidity.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.shock) ) || contract.shock.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.lightExposure) ) || contract.lightExposure.reqID._value!==contract.requested.reqID._value)) { 
                      //AC
                      let transitionState = contract.obligations.oDeliver.state;
                      contract.obligations.oDeliver.fulfilled()
                      //AC
                      let controllers = contract.obligations.oDeliver._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.oDeliver.state+","+contract.obligations.oDeliver.name+", " + contract.obligations.oDeliver.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.oDeliver', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oDeliver,[contract.obligations.oDeliver.creditor,contract.obligations.oDeliver.debtor],contract.obligations.oDeliver.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                      
                    }
                  }
                },
  activateObligation_oAgreedOnRequest(contract) {
    if (contract.obligations.oAgreedOnRequest != null && (Predicates.happens(contract.agreedFromG) )) { 
      contract.obligations.oAgreedOnRequest.activated()
                    if (Predicates.strongHappensBefore(contract.leadtimeINform, contract.agreedFromG._timestamp)  && contract.leadtimeINform.reqID._value===contract.requested.reqID._value && contract.agreedFromG.reqID._value===contract.requested.reqID._value && (contract.requested.dosage._value >= contract.minQuantity && contract.requested.dosage._value <= contract.remain.value._value)) { 
                      //AC
                      let transitionState = contract.obligations.oAgreedOnRequest.state;
                      contract.obligations.oAgreedOnRequest.fulfilled()
                      //AC
                      let controllers = contract.obligations.oAgreedOnRequest._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.oAgreedOnRequest.state+","+contract.obligations.oAgreedOnRequest.name+", " + contract.obligations.oAgreedOnRequest.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.oAgreedOnRequest', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAgreedOnRequest,[contract.obligations.oAgreedOnRequest.creditor,contract.obligations.oAgreedOnRequest.debtor],contract.obligations.oAgreedOnRequest.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                      
                    }
                  }
                },
  activateObligation_oAssign(contract) {
    if (contract.obligations.oAssign != null && (Predicates.happens(contract.delivered)  && contract.delivered.reqID._value===contract.requested.reqID._value)) { 
      contract.obligations.oAssign.activated()
                    if (Predicates.happens(contract.obligations.oDeliver && contract.obligations.oDeliver._events.Fulfilled)  && contract.delivered.reqID._value===contract.requested.reqID._value) { 
                     contract.remain.value._value = contract.remain.value._value - contract.delivered.dosage._value 
                     contract.paidAmount.value._value = contract.delivered.dosage._value * contract.vaccineDose.price._value 
                      //AC
                      let transitionState = contract.obligations.oAssign.state;
                      contract.obligations.oAssign.fulfilled()
                      //AC
                      let controllers = contract.obligations.oAssign._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.oAssign.state+","+contract.obligations.oAssign.name+", " + contract.obligations.oAssign.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.oAssign', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAssign,[contract.obligations.oAssign.creditor,contract.obligations.oAssign.debtor],contract.obligations.oAssign.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                      
                    }
                  }
                },
                activateSurvivingObligation_oPay(contract) {
                  if (contract.survivingObligations.oPay != null  && (Predicates.happens(contract.invoiced)  && contract.vaccineDose.FDAapproval._value===true && contract.invoiced.reqID._value===contract.requested.reqID._value && Predicates.happens(contract.obligations.oDeliver && contract.obligations.oDeliver._events.Fulfilled)  && Predicates.strongHappensBefore(contract.delivered, contract.invoiced._timestamp)  && contract.delivered.reqID._value===contract.requested.reqID._value)  ) { 
                    contract.survivingObligations.oPay.activated()
                    if (Predicates.strongHappensBefore(contract.paid, Utils.addTime(contract.invoiced.date._value, 30, "days"))  && contract.invoiced.reqID._value===contract.requested.reqID._value && contract.invoiced.reqID._value===contract.paid.reqID._value && contract.paid.amount._value===contract.paidAmount.value._value) { 
                      let transitionState = contract.survivingObligations.oPay.state;
                      contract.survivingObligations.oPay.fulfilled()
                      let controllers = contract.survivingObligations.oPay._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.survivingObligations.oPay.state+","+contract.survivingObligations.oPay.name+", " + contract.survivingObligations.oPay.contract.id;
                 		contract.notified.message.push({name: 'contract.survivingObligations.oPay', message: MSG, roles:contract.accessPolicy.permissionValid(contract.survivingObligations.oPay,[contract.survivingObligations.oPay.creditor,contract.survivingObligations.oPay.debtor],contract.survivingObligations.oPay.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    }
                  }
                },
                activateSurvivingObligation_oWithdrewApproval(contract) {
                  if (contract.survivingObligations.oWithdrewApproval != null  && (Predicates.happens(contract.withdrewApproval) )  ) { 
                    contract.survivingObligations.oWithdrewApproval.activated()
                    if (true) { 
                     contract.vaccineDose.FDAapproval._value = false 
                      let transitionState = contract.survivingObligations.oWithdrewApproval.state;
                      contract.survivingObligations.oWithdrewApproval.fulfilled()
                      let controllers = contract.survivingObligations.oWithdrewApproval._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.survivingObligations.oWithdrewApproval.state+","+contract.survivingObligations.oWithdrewApproval.name+", " + contract.survivingObligations.oWithdrewApproval.contract.id;
                 		contract.notified.message.push({name: 'contract.survivingObligations.oWithdrewApproval', message: MSG, roles:contract.accessPolicy.permissionValid(contract.survivingObligations.oWithdrewApproval,[contract.survivingObligations.oWithdrewApproval.creditor,contract.survivingObligations.oWithdrewApproval.debtor],contract.survivingObligations.oWithdrewApproval.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    }
                  }
                },
                activatePower_pStopWork(contract) {
                  if (contract.powers.pStopWork != null && (Predicates.happens(contract.govStopWork) )) {  
                    contract.powers.pStopWork.activated()
                  }
                },
                fulfillObligation_oDeliver(contract) {
                  if (contract.obligations.oDeliver != null && (Predicates.strongHappensBefore(contract.notifiedOD, contract.confirmed._timestamp)  && Predicates.happens(contract.delivered)  && contract.delivered.delAddr._value===contract.confirmed.shipToLocation._value && contract.vaccineDose.FDAapproval._value===true && contract.delivered.reqID._value===contract.requested.reqID._value && contract.notifiedOD.reqID._value===contract.requested.reqID._value && contract.confirmed.reqID._value===contract.requested.reqID._value && ((contract.delivered.date._value===contract.notifiedOD.delD._value) || (Predicates.happens(contract.outsideRisk)  && contract.delivered.date._value===contract.outsideRisk.extendedDel._value && contract.requested.reqID._value===contract.outsideRisk.reqID._value)) && (!(Predicates.happens(contract.temperature) ) || contract.temperature.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.sealOpen) ) || contract.sealOpen.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.humidity) ) || contract.humidity.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.shock) ) || contract.shock.reqID._value!==contract.requested.reqID._value) && (!(Predicates.happens(contract.lightExposure) ) || contract.lightExposure.reqID._value!==contract.requested.reqID._value)) ) { 
                    let transitionState = contract.obligations.oDeliver.state;
                    contract.obligations.oDeliver.fulfilled()
                      let controllers = contract.obligations.oDeliver._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.oDeliver.state+","+contract.obligations.oDeliver.name+", " + contract.obligations.oDeliver.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.oDeliver', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oDeliver,[contract.obligations.oDeliver.creditor,contract.obligations.oDeliver.debtor],contract.obligations.oDeliver.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
                  }
                },
                fulfillObligation_oAgreedOnRequest(contract) {
                  if (contract.obligations.oAgreedOnRequest != null && (Predicates.strongHappensBefore(contract.leadtimeINform, contract.agreedFromG._timestamp)  && contract.leadtimeINform.reqID._value===contract.requested.reqID._value && contract.agreedFromG.reqID._value===contract.requested.reqID._value && (contract.requested.dosage._value >= contract.minQuantity && contract.requested.dosage._value <= contract.remain.value._value)) ) { 
                    let transitionState = contract.obligations.oAgreedOnRequest.state;
                    contract.obligations.oAgreedOnRequest.fulfilled()
                      let controllers = contract.obligations.oAgreedOnRequest._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.oAgreedOnRequest.state+","+contract.obligations.oAgreedOnRequest.name+", " + contract.obligations.oAgreedOnRequest.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.oAgreedOnRequest', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAgreedOnRequest,[contract.obligations.oAgreedOnRequest.creditor,contract.obligations.oAgreedOnRequest.debtor],contract.obligations.oAgreedOnRequest.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
                  }
                },
                fulfillObligation_oRequestVaccineDosage(contract) {
                  if (contract.obligations.oRequestVaccineDosage != null && ((contract.remain.value._value < contract.minQuantity) && Predicates.happens(contract.obligations.oAgreedOnRequest && contract.obligations.oAgreedOnRequest._events.Fulfilled)  && Predicates.happens(contract.obligations.oDeliver && contract.obligations.oDeliver._events.Fulfilled)  && Predicates.happens(contract.obligations.oAssign && contract.obligations.oAssign._events.Fulfilled)  && Predicates.happens(contract.mcdcTerminateAgreement)  && Predicates.happens(contract.pfizerTerminateAgreement) ) ) { 
                    let transitionState = contract.obligations.oRequestVaccineDosage.state;
                    contract.obligations.oRequestVaccineDosage.fulfilled()
                      let controllers = contract.obligations.oRequestVaccineDosage._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.oRequestVaccineDosage.state+","+contract.obligations.oRequestVaccineDosage.name+", " + contract.obligations.oRequestVaccineDosage.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.oRequestVaccineDosage', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oRequestVaccineDosage,[contract.obligations.oRequestVaccineDosage.creditor,contract.obligations.oRequestVaccineDosage.debtor],contract.obligations.oRequestVaccineDosage.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
                  }
                },
                fulfillObligation_oAssign(contract) {
                  if (contract.obligations.oAssign != null && (Predicates.happens(contract.obligations.oDeliver && contract.obligations.oDeliver._events.Fulfilled)  && contract.delivered.reqID._value===contract.requested.reqID._value) ) { 
                   contract.remain.value._value = contract.remain.value._value - contract.delivered.dosage._value 
                   contract.paidAmount.value._value = contract.delivered.dosage._value * contract.vaccineDose.price._value 
                    let transitionState = contract.obligations.oAssign.state;
                    contract.obligations.oAssign.fulfilled()
                      let controllers = contract.obligations.oAssign._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.oAssign.state+","+contract.obligations.oAssign.name+", " + contract.obligations.oAssign.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.oAssign', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.oAssign,[contract.obligations.oAssign.creditor,contract.obligations.oAssign.debtor],contract.obligations.oAssign.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
                  }
                },
                fulfillSurvivingObligation_oPay(contract) {
                  if (contract.survivingObligations.oPay != null && Predicates.strongHappensBefore(contract.paid, Utils.addTime(contract.invoiced.date._value, 30, "days"))  && contract.invoiced.reqID._value===contract.requested.reqID._value && contract.invoiced.reqID._value===contract.paid.reqID._value && contract.paid.amount._value===contract.paidAmount.value._value ) { 
                    let transitionState = contract.survivingObligations.oPay.state;
                    contract.survivingObligations.oPay.fulfilled()
                    //AC
	                          let controllers = contract.survivingObligations.oPay._controller
	                     		//notify
	                     		let MSG= transitionState+" Changed to "+contract.survivingObligations.oPay.state+","+contract.survivingObligations.oPay.name+", " + contract.survivingObligations.oPay.contract.id;
	                     		contract.notified.message.push({name: 'contract.survivingObligations.oPay', message: MSG, roles:contract.accessPolicy.permissionValid(contract.survivingObligations.oPay,[contract.survivingObligations.oPay.creditor,contract.survivingObligations.oPay.debtor],contract.survivingObligations.oPay.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
                  }
                },
                successfullyTerminateContract(contract) {
                  for (const oblKey of Object.keys(contract.obligations)) {
                    if (contract.obligations[oblKey].isActive()) {
                      return;
                    }
                    if (contract.obligations[oblKey].isViolated() && Array.isArray(contract.obligations[oblKey]._createdPowerNames)) {
                      for (const pKey of contract.obligations[oblKey]._createdPowerNames) {
                        if (!contract.powers[pKey].isSuccessfulTermination()) {
                          return;
                        }
                      }
                    }
                  }
                  contract.fulfilledActiveObligations()
                  // if all the obligations are fullfilled (this include the notification on their functions in the listner in events) so the contract will be terminate successfully. Then
                  // the roles must be notified by only contract state
                  // contract notification
                  let controllers = contract._controller
             		//notify
             		let MSG= " Contract "+contract.name+" is Successfully Terminated,"+", " + contract.id;
             		contract.notified.message.push({name: contract.name, message: MSG, roles:contract.accessPolicy.permissionValid(contract,controllers,contract.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                },
                unsuccessfullyTerminateContract(contract) {
                  for (let index in contract.obligations) {
                    contract.obligations[index].terminated({emitEvent: false})
                    let obl=contract.obligations[index]
                      let controllers = obl._controller
  	                 	  //notify
  	                 	  let MSG= " Power "+obl.name+" is "+obl.state+ " because contract is terminated unsuccessfully,"+", " + obl.contract.id;
  	                 	  contract.notified.message.push({name: obl.name, message: MSG, roles:contract.accessPolicy.permissionValid(obl,controllers,obl.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                                             
                  }
                  for (let index in contract.powers) {
                    contract.powers[index].terminated()
                    let power=contract.powers[index]
                    let controllers = power._controller
	                 	  //notify
	                 	  let MSG= " Power "+power.name+" is "+power.state+ " because contract is terminated unsuccessfully,"+", " + power.contract.id;
	                 	  contract.notified.message.push({name: power.name, message: MSG, roles:contract.accessPolicy.permissionValid(power,controllers,power.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
                  }
                  contract.terminated()
                  let controllers = contract._controller
             		//notify
             		let MSG= " Contract "+contract.name+" is Unsuccessfully Terminated,"+", " + contract.id;
             		contract.notified.message.push({name: contract.name, message: MSG, roles:contract.accessPolicy.permissionValid(contract,controllers,contract.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                  
                }     
              }
              
              function getEventMap(contract) {
                return [
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.requested), ], EventListeners.createObligation_oDeliver],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.requested), ], EventListeners.createObligation_oAgreedOnRequest],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.requested), ], EventListeners.createObligation_oAssign],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.requested), ], EventListeners.createSurvivingObligation_oPay],
                  [[new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Fulfilled, contract.obligations.oRequestVaccineDosage), ], EventListeners.createPower_pTermination],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.lawStopWork), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.adminStopWork), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.regulationStopWork), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.judicialStopWork), ], EventListeners.createPower_pStopWork],
                  [[new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Fulfilled, contract.obligations.oAgreedOnRequest), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.confirmed), ], EventListeners.activateObligation_oDeliver],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.agreedFromG), ], EventListeners.activateObligation_oAgreedOnRequest],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.delivered), ], EventListeners.activateObligation_oAssign],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.invoiced), new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Fulfilled, contract.obligations.oDeliver), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.delivered), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.invoiced), ], EventListeners.activateSurvivingObligation_oPay],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.withdrewApproval), ], EventListeners.activateSurvivingObligation_oWithdrewApproval],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.govStopWork), ], EventListeners.activatePower_pStopWork],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.notifiedOD), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.confirmed), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.delivered), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.outsideRisk), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.temperature), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.sealOpen), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.humidity), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.shock), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.lightExposure), ], EventListeners.fulfillObligation_oDeliver],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.leadtimeINform), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.agreedFromG), ], EventListeners.fulfillObligation_oAgreedOnRequest],
                  [[new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Fulfilled, contract.obligations.oAgreedOnRequest), new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Fulfilled, contract.obligations.oDeliver), new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Fulfilled, contract.obligations.oAssign), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.mcdcTerminateAgreement), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.pfizerTerminateAgreement), ], EventListeners.fulfillObligation_oRequestVaccineDosage],
                  [[new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Fulfilled, contract.obligations.oDeliver), ], EventListeners.fulfillObligation_oAssign],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.paid), ], EventListeners.fulfillSurvivingObligation_oPay],
                ]
              }
              
              module.exports.EventListeners = EventListeners
              module.exports.getEventMap = getEventMap
