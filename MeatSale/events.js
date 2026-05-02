const { LegalSituation, InternalEventSource, InternalEvent, InternalEventType } = require("symboleoac-js-core")
const { Obligation } = require("symboleoac-js-core")
const { Power } = require("symboleoac-js-core")
const { Predicates } = require("symboleoac-js-core")
const { Utils } = require("symboleoac-js-core")
const { Str } = require("symboleoac-js-core")
const { Currency } = require("./domain/types/Currency.js")
const { MeatQuality } = require("./domain/types/MeatQuality.js")
const { ACPolicy } = require("symboleoac-js-core")
const { Resource } = require("symboleoac-js-core")

const EventListeners = {
  createObligation_latePayment(contract) {
    if (Predicates.happens(contract.obligations.payment && contract.obligations.payment._events.Violated) ) { 
      if (contract.obligations.latePayment == null || contract.obligations.latePayment.isFinished()) {
        const isNewInstance =  contract.obligations.latePayment != null && contract.obligations.latePayment.isFinished()
        contract.latePaymentSituation = new LegalSituation();

contract.latePaymentSituation.addConsequentOf({_type: 'eventCondition', resource:"paidLate", resourceType:"PaidLate"} )
         contract.obligations.latePayment = new Obligation('latePayment', contract.seller, contract.buyer, contract, contract.latePaymentSituation)
        if (true ) { 
          contract.obligations.latePayment.trigerredUnconditional()
          let transitionState = contract.obligations.latePayment.state;
          if (!isNewInstance && Predicates.happens(contract.paidLate) ) { 
            contract.obligations.latePayment.fulfilled()
            let controllers = contract.obligations.latePayment._controller
       		//notify
       		let MSG= transitionState+" Changed to "+contract.obligations.latePayment.state+","+contract.obligations.latePayment.name+", " + contract.obligations.latePayment.contract.id;
       		contract.notified.message.push({name: 'contract.obligations.latePayment', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.latePayment,[contract.obligations.latePayment.creditor,contract.obligations.latePayment.debtor],contract.obligations.latePayment.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
          }
        } else {
          contract.obligations.latePayment.trigerredConditional()
        }
      }
    }
  },
  createObligation_inspectMeat(contract) {
    if (Predicates.happens(contract.delivered) ) { 
      if (contract.obligations.inspectMeat == null || contract.obligations.inspectMeat.isFinished()) {
        const isNewInstance =  contract.obligations.inspectMeat != null && contract.obligations.inspectMeat.isFinished()
        contract.inspectMeatSituation = new LegalSituation();

contract.inspectMeatSituation.addConsequentOf({_type: 'eventCondition', resource:"inspectedQuality", resourceType:"InspectedQuality"} )
 contract.inspectMeatSituation.addConsequentOf({ leftSide:'contract.inspectedQuality.barFound._value', op:'===', rightSide: 'contract.goods.barcode._value', _type: 'Condition'})
 contract.inspectMeatSituation.addConsequentOf({ leftSide:'contract.inspectedQuality.qualityFound._value', op:'===', rightSide: 'contract.goods.quality._value', _type: 'Condition'})
 contract.inspectMeatSituation.addConsequentOf({ leftSide:'contract.inspectedQuality.quantityFound._value', op:'===', rightSide: 'contract.goods.quantity._value', _type: 'Condition'})
        
        contract.inspectMeatSituation.addAntecedentOf({_type: 'eventCondition', resource:"passwordNotification", resourceType:"PasswordNotification"} )
         contract.obligations.inspectMeat = new Obligation('inspectMeat', contract.buyer, contract.assessor, contract, contract.inspectMeatSituation)
        if (!isNewInstance  ) { 
          contract.obligations.inspectMeat.trigerredUnconditional()
          let transitionState = contract.obligations.inspectMeat.state;
          if (!isNewInstance && Predicates.happens(contract.inspectedQuality)  && contract.inspectedQuality.barFound._value===contract.goods.barcode._value && contract.inspectedQuality.qualityFound._value===contract.goods.quality._value && contract.inspectedQuality.quantityFound._value===contract.goods.quantity._value) { 
            contract.obligations.inspectMeat.fulfilled()
            let controllers = contract.obligations.inspectMeat._controller
       		//notify
       		let MSG= transitionState+" Changed to "+contract.obligations.inspectMeat.state+","+contract.obligations.inspectMeat.name+", " + contract.obligations.inspectMeat.contract.id;
       		contract.notified.message.push({name: 'contract.obligations.inspectMeat', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.inspectMeat,[contract.obligations.inspectMeat.creditor,contract.obligations.inspectMeat.debtor],contract.obligations.inspectMeat.getController(controllers.length - 1), contract) , time: new Date().toISOString()})         
          }
        } else {
          contract.obligations.inspectMeat.trigerredConditional()
        }
      }
    }
  },
  createPower_terminateContract(contract) {
    const effects = { powerCreated: false }
    if (Predicates.happens(contract.obligations.delivery && contract.obligations.delivery._events.Violated) ) { 
      if (contract.powers.terminateContract == null || contract.powers.terminateContract.isFinished()){
        const isNewInstance =  contract.powers.terminateContract != null && contract.powers.terminateContract.isFinished()
        contract.terminateContractSituation = new LegalSituation();            
        contract.terminateContractSituation.addConsequentOf({_type: 'stateCondition',resourceType: 'contract', resource: 'contract', state:'unsuccessfultermination'})
        contract.powers.terminateContract = new Power('terminateContract', contract.buyer, contract.seller, contract, contract.terminateContractSituation)
        effects.powerCreated = true
        effects.powerName = 'terminateContract'
        if (true ) { 
          contract.powers.terminateContract.trigerredUnconditional()
        } else {
          contract.powers.terminateContract.trigerredConditional()
        }
      }
    }
    return effects
  },
  createPower_suspendDelivery(contract) {
    const effects = { powerCreated: false }
    if (Predicates.happens(contract.obligations.payment && contract.obligations.payment._events.Violated) ) { 
      if (contract.powers.suspendDelivery == null || contract.powers.suspendDelivery.isFinished()){
        const isNewInstance =  contract.powers.suspendDelivery != null && contract.powers.suspendDelivery.isFinished()
        contract.suspendDeliverySituation = new LegalSituation();            
        contract.suspendDeliverySituation.addConsequentOf({_type: 'stateCondition',resourceType: 'obligation', resource: 'delivery', state:'suspension'})
        contract.powers.suspendDelivery = new Power('suspendDelivery', contract.seller, contract.buyer, contract, contract.suspendDeliverySituation)
        effects.powerCreated = true
        effects.powerName = 'suspendDelivery'
        contract.powers.suspendDelivery.addController(this.seller)
        contract.accessPolicy.addRulee("grant", "write", contract.powers.suspendDelivery, contract.transportCo, contract.seller)
        if (true ) { 
          contract.powers.suspendDelivery.trigerredUnconditional()
        } else {
          contract.powers.suspendDelivery.trigerredConditional()
        }
      }
    }
    return effects
  },
  createPower_resumeDelivery(contract) {
    const effects = { powerCreated: false }
    if (Predicates.happensWithin(contract.paidLate, contract.obligations.delivery, "Obligation.Suspension") ) { 
      if (contract.powers.resumeDelivery == null || contract.powers.resumeDelivery.isFinished()){
        const isNewInstance =  contract.powers.resumeDelivery != null && contract.powers.resumeDelivery.isFinished()
        contract.resumeDeliverySituation = new LegalSituation();            
        contract.resumeDeliverySituation.addConsequentOf({_type: 'stateCondition',resourceType: 'obligation', resource: 'delivery', state:'suspension'})
        contract.powers.resumeDelivery = new Power('resumeDelivery', contract.buyer, contract.seller, contract, contract.resumeDeliverySituation)
        effects.powerCreated = true
        effects.powerName = 'resumeDelivery'
        contract.accessPolicy.addRulee("grant", "write", contract.powers.resumeDelivery, contract.transportCo, contract.seller)
        if (true ) { 
          contract.powers.resumeDelivery.trigerredUnconditional()
        } else {
          contract.powers.resumeDelivery.trigerredConditional()
        }
      }
    }
    return effects
  },
  activateObligation_payment(contract) {
    if (contract.obligations.payment != null && (Predicates.happens(contract.unLoaded) )) { 
      contract.obligations.payment.activated()
                    if (Predicates.weakHappensBefore(contract.paid, contract.paid.payDueDate._value) ) { 
                      //AC
                      let transitionState = contract.obligations.payment.state;
                      contract.obligations.payment.fulfilled()
                      //AC
                      let controllers = contract.obligations.payment._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.payment.state+","+contract.obligations.payment.name+", " + contract.obligations.payment.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.payment', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.payment,[contract.obligations.payment.creditor,contract.obligations.payment.debtor],contract.obligations.payment.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                      
                    }
                  }
                },
  activateObligation_inspectMeat(contract) {
    if (contract.obligations.inspectMeat != null && (Predicates.happens(contract.passwordNotification) )) { 
      contract.obligations.inspectMeat.activated()
                    if (Predicates.happens(contract.inspectedQuality)  && contract.inspectedQuality.barFound._value===contract.goods.barcode._value && contract.inspectedQuality.qualityFound._value===contract.goods.quality._value && contract.inspectedQuality.quantityFound._value===contract.goods.quantity._value) { 
                      //AC
                      let transitionState = contract.obligations.inspectMeat.state;
                      contract.obligations.inspectMeat.fulfilled()
                      //AC
                      let controllers = contract.obligations.inspectMeat._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.inspectMeat.state+","+contract.obligations.inspectMeat.name+", " + contract.obligations.inspectMeat.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.inspectMeat', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.inspectMeat,[contract.obligations.inspectMeat.creditor,contract.obligations.inspectMeat.debtor],contract.obligations.inspectMeat.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                      
                    }
                  }
                },
                fulfillObligation_latePayment(contract) {
                  if (contract.obligations.latePayment != null && (Predicates.happens(contract.paidLate) ) ) { 
                    let transitionState = contract.obligations.latePayment.state;
                    contract.obligations.latePayment.fulfilled()
                      let controllers = contract.obligations.latePayment._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.latePayment.state+","+contract.obligations.latePayment.name+", " + contract.obligations.latePayment.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.latePayment', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.latePayment,[contract.obligations.latePayment.creditor,contract.obligations.latePayment.debtor],contract.obligations.latePayment.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
                  }
                },
                fulfillObligation_payment(contract) {
                  if (contract.obligations.payment != null && (Predicates.weakHappensBefore(contract.paid, contract.paid.payDueDate._value) ) ) { 
                    let transitionState = contract.obligations.payment.state;
                    contract.obligations.payment.fulfilled()
                      let controllers = contract.obligations.payment._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.payment.state+","+contract.obligations.payment.name+", " + contract.obligations.payment.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.payment', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.payment,[contract.obligations.payment.creditor,contract.obligations.payment.debtor],contract.obligations.payment.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
                  }
                },
                fulfillObligation_inspectMeat(contract) {
                  if (contract.obligations.inspectMeat != null && (Predicates.happens(contract.inspectedQuality)  && contract.inspectedQuality.barFound._value===contract.goods.barcode._value && contract.inspectedQuality.qualityFound._value===contract.goods.quality._value && contract.inspectedQuality.quantityFound._value===contract.goods.quantity._value) ) { 
                    let transitionState = contract.obligations.inspectMeat.state;
                    contract.obligations.inspectMeat.fulfilled()
                      let controllers = contract.obligations.inspectMeat._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.inspectMeat.state+","+contract.obligations.inspectMeat.name+", " + contract.obligations.inspectMeat.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.inspectMeat', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.inspectMeat,[contract.obligations.inspectMeat.creditor,contract.obligations.inspectMeat.debtor],contract.obligations.inspectMeat.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
                  }
                },
                fulfillObligation_delivery(contract) {
                  if (contract.obligations.delivery != null && (Predicates.weakHappensBefore(contract.delivered, contract.delivered.delDueDate._value)  && contract.delivered.deliveryAddress._value===contract.buyer.warehouse._value && !(Predicates.happens(contract.temperature) ) && !(Predicates.happens(contract.humidity) )) ) { 
                    let transitionState = contract.obligations.delivery.state;
                    contract.obligations.delivery.fulfilled()
                      let controllers = contract.obligations.delivery._controller
                 		//notify
                 		let MSG= transitionState+" Changed to "+contract.obligations.delivery.state+","+contract.obligations.delivery.name+", " + contract.obligations.delivery.contract.id;
                 		contract.notified.message.push({name: 'contract.obligations.delivery', message: MSG, roles:contract.accessPolicy.permissionValid(contract.obligations.delivery,[contract.obligations.delivery.creditor,contract.obligations.delivery.debtor],contract.obligations.delivery.getController(controllers.length - 1), contract) , time: new Date().toISOString()}) 
                    
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
                  [[new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Violated, contract.obligations.payment), ], EventListeners.createObligation_latePayment],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.delivered), ], EventListeners.createObligation_inspectMeat],
                  [[new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Violated, contract.obligations.delivery), ], EventListeners.createPower_terminateContract],
                  [[new InternalEvent(InternalEventSource.obligation, InternalEventType.obligation.Violated, contract.obligations.payment), ], EventListeners.createPower_suspendDelivery],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.paidLate), ], EventListeners.createPower_resumeDelivery],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.unLoaded), ], EventListeners.activateObligation_payment],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.passwordNotification), ], EventListeners.activateObligation_inspectMeat],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.paidLate), ], EventListeners.fulfillObligation_latePayment],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.paid), ], EventListeners.fulfillObligation_payment],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.inspectedQuality), ], EventListeners.fulfillObligation_inspectMeat],
                  [[new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.delivered), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.temperature), new InternalEvent(InternalEventSource.contractEvent, InternalEventType.contractEvent.Happened, contract.humidity), ], EventListeners.fulfillObligation_delivery],
                ]
              }
              
              module.exports.EventListeners = EventListeners
              module.exports.getEventMap = getEventMap
