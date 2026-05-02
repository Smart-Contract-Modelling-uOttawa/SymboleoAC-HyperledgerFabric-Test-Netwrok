  const { VaccineDose } = require("../assets/VaccineDose.js")
  const { Remain } = require("../assets/Remain.js")
  const { PaidAmount } = require("../assets/PaidAmount.js")
  const { Invoiced } = require("../events/Invoiced.js")
  const { Paid } = require("../events/Paid.js")
  const { Requested } = require("../events/Requested.js")
  const { LeadtimeInformedNegotiated } = require("../events/LeadtimeInformedNegotiated.js")
  const { NotifiedOfDelivery } = require("../events/NotifiedOfDelivery.js")
  const { Confirmed } = require("../events/Confirmed.js")
  const { Delivered } = require("../events/Delivered.js")
  const { StopWork } = require("../events/StopWork.js")
  const { ThirdPartyStopWork } = require("../events/ThirdPartyStopWork.js")
  const { Agreed } = require("../events/Agreed.js")
  const { Risk } = require("../events/Risk.js")
  const { WithdrewApproval } = require("../events/WithdrewApproval.js")
  const { TerminateAgreementG } = require("../events/TerminateAgreementG.js")
  const { TerminateAgreementM } = require("../events/TerminateAgreementM.js")
  const { Alert } = require("../events/datatransfer/Alert.js")
  const { Manufacturer } = require("../roles/Manufacturer.js")
  const { Government } = require("../roles/Government.js")
  const { Regulator } = require("../roles/Regulator.js")
  const { Admin } = require("../roles/Admin.js")
  const { WorldCourier } = require("../roles/WorldCourier.js")
  const { FDA } = require("../roles/FDA.js")
  const { Location } = require("../types/Location.js")
  const { SymboleoContract } = require("symboleoac-js-core")
  const { Obligation } = require("symboleoac-js-core")
  const { Power } = require("symboleoac-js-core")
  const { Utils } = require("symboleoac-js-core")
  const { Str } = require("symboleoac-js-core")
  const { ACPolicy } = require("symboleoac-js-core")
  const { Notified } = require("../events/Notified.js")
  const { Attribute } = require("symboleoac-js-core")
  const { Rule } = require("symboleoac-js-core")
  const { LegalSituation } = require("symboleoac-js-core")
  const { contracts } = require("../../index.js")
  
  class VaccineProcurementC extends SymboleoContract {
    constructor(pfizerP, mcdcP, regulatorP, adminP, fdaP, worldcourierP, approval, unitPrice, minQuantity, maxQuantity) {
      super("VaccineProcurementC")
      this._name = "VaccineProcurementC"
      this.pfizerP = pfizerP
      this.mcdcP = mcdcP
      this.regulatorP = regulatorP
      this.adminP = adminP
      this.fdaP = fdaP
      this.worldcourierP = worldcourierP
      this.approval = approval
      this.unitPrice = unitPrice
      this.minQuantity = minQuantity
      this.maxQuantity = maxQuantity
      
      this.obligations = {};
      this.survivingObligations = {};
      this.powers = {};
      //notification 
      this.notified = new Notified ('notified')
      // assign varaibles of the contract
      		this.regulator = new Regulator("regulator")
      
this.regulator.name._value = this.regulatorP.name
this.regulator.org._value = this.regulatorP.org
this.regulator.dept._value = this.regulatorP.dept
       this.regulator.addController(this.regulator)  
       	 this.addRole(this.regulator)
      		this.admin = new Admin("admin")
      
this.admin.name._value = this.adminP.name
this.admin.org._value = this.adminP.org
this.admin.dept._value = this.adminP.dept
       this.admin.addController(this.admin)  
       	 this.addRole(this.admin)
      		this.pfizer = new Manufacturer("pfizer")
      
this.pfizer.name._value = this.pfizerP.name
this.pfizer.org._value = this.pfizerP.org
this.pfizer.dept._value = this.pfizerP.dept
       this.pfizer.addController(this.pfizer)  
       	 this.addRole(this.pfizer)
      		this.mcdc = new Government("mcdc")
      
this.mcdc.name._value = this.mcdcP.name
this.mcdc.org._value = this.mcdcP.org
this.mcdc.dept._value = this.mcdcP.dept
       this.mcdc.addController(this.mcdc)  
       	 this.addRole(this.mcdc)
      		this.fda = new FDA("fda")
      
this.fda.name._value = this.fdaP.name
this.fda.org._value = this.fdaP.org
this.fda.dept._value = this.fdaP.dept
       this.fda.addController(this.fda)  
       	 this.addRole(this.fda)
      		this.worldcourier = new WorldCourier("worldcourier")
      
this.worldcourier.name._value = this.worldcourierP.name
this.worldcourier.org._value = this.worldcourierP.org
this.worldcourier.dept._value = this.worldcourierP.dept
       this.worldcourier.addController(this.worldcourier)  
       	 this.addRole(this.worldcourier)
      		this.requested = new Requested("requested")
      
      this.requested.addPerformer(this.mcdc)
this.requested.addController(this.mcdc)
      		this.leadtimeINform = new LeadtimeInformedNegotiated("leadtimeINform")
      
      this.leadtimeINform.addPerformer(this.pfizer)
this.leadtimeINform.addController(this.pfizer)
      		this.notifiedOD = new NotifiedOfDelivery("notifiedOD")
      
      this.notifiedOD.addPerformer(this.pfizer)
this.notifiedOD.addController(this.pfizer)
      		this.delivered = new Delivered("delivered")
      
      this.delivered.addPerformer(this.worldcourier)
this.delivered.addController(this.pfizer)
      		this.invoiced = new Invoiced("invoiced")
      
      this.invoiced.addPerformer(this.mcdc)
this.invoiced.addController(this.mcdc)
      		this.paid = new Paid("paid")
      
      this.paid.addPerformer(this.mcdc)
this.paid.addController(this.mcdc)
      		this.confirmed = new Confirmed("confirmed")
      
      this.confirmed.addPerformer(this.mcdc)
this.confirmed.addController(this.mcdc)
      		this.lawStopWork = new StopWork("lawStopWork")
      
      this.lawStopWork.addPerformer(this.mcdc)
this.lawStopWork.addController(this.mcdc)
      		this.regulationStopWork = new ThirdPartyStopWork("regulationStopWork")
      
      this.regulationStopWork.addPerformer(this.regulator)
this.regulationStopWork.addController(this.regulator)
      		this.judicialStopWork = new ThirdPartyStopWork("judicialStopWork")
      
      this.judicialStopWork.addPerformer(this.regulator)
this.judicialStopWork.addController(this.regulator)
      		this.adminStopWork = new ThirdPartyStopWork("adminStopWork")
      
      this.adminStopWork.addPerformer(this.regulator)
this.adminStopWork.addController(this.regulator)
      		this.govStopWork = new StopWork("govStopWork")
      
      this.govStopWork.addPerformer(this.mcdc)
this.govStopWork.addController(this.mcdc)
      		this.vaccineDose = new VaccineDose("vaccineDose")
      
this.vaccineDose.price._value = this.unitPrice
this.vaccineDose.FDAapproval._value = this.approval
this.vaccineDose.owner = this.pfizer
       this.vaccineDose.addController(this.pfizer)  
      		this.agreedFromG = new Agreed("agreedFromG")
      
      this.agreedFromG.addPerformer(this.mcdc)
this.agreedFromG.addController(this.mcdc)
      		this.outsideRisk = new Risk("outsideRisk")
      
      this.outsideRisk.addPerformer(this.pfizer)
this.outsideRisk.addController(this.pfizer)
      		this.remain = new Remain("remain")
      
this.remain.value._value = this.maxQuantity
this.remain.owner = this.mcdc
       this.remain.addController(this.mcdc)  
      		this.paidAmount = new PaidAmount("paidAmount")
      
this.paidAmount.value._value = 0
this.paidAmount.owner = this.mcdc
       this.paidAmount.addController(this.mcdc)  
      		this.withdrewApproval = new WithdrewApproval("withdrewApproval")
      
      this.withdrewApproval.addPerformer(this.fda)
this.withdrewApproval.addController(this.fda)
      		this.mcdcTerminateAgreement = new TerminateAgreementG("mcdcTerminateAgreement")
      
      this.mcdcTerminateAgreement.addPerformer(this.mcdc)
this.mcdcTerminateAgreement.addController(this.mcdc)
      		this.pfizerTerminateAgreement = new TerminateAgreementM("pfizerTerminateAgreement")
      
      this.pfizerTerminateAgreement.addPerformer(this.pfizer)
this.pfizerTerminateAgreement.addController(this.pfizer)
      		this.temperature = new Alert("temperature")
      
this.temperature.condition._value = "value > -80"
this.temperature.window._value = "10"
this.temperature.count._value = "5"
this.temperature.addController(this.pfizer)
      this.temperature.addPerformer(this.regulator)
      		this.humidity = new Alert("humidity")
      
this.humidity.condition._value = "value > 70"
this.humidity.window._value = "15"
this.humidity.count._value = "3"
this.humidity.addController(this.pfizer)
      this.humidity.addPerformer(this.regulator)
      		this.shock = new Alert("shock")
      
this.shock.condition._value = "value > 5"
this.shock.window._value = ""
this.shock.count._value = ""
this.shock.addController(this.pfizer)
      this.shock.addPerformer(this.regulator)
      		this.lightExposure = new Alert("lightExposure")
      
this.lightExposure.condition._value = "value > 0"
this.lightExposure.window._value = ""
this.lightExposure.count._value = ""
this.lightExposure.addController(this.pfizer)
      this.lightExposure.addPerformer(this.regulator)
      		this.sealOpen = new Alert("sealOpen")
      
this.sealOpen.condition._value = "value > 0"
this.sealOpen.window._value = ""
this.sealOpen.count._value = ""
this.sealOpen.addController(this.pfizer)
      this.sealOpen.addPerformer(this.regulator)
this.accessPolicy = new ACPolicy([this.regulator])
this.addController(this.pfizer); 
this.addController(this.mcdc); 
      // create instance of triggered obligations
          	    this.oRequestVaccineDosageSituation = new LegalSituation();
          	  this.oRequestVaccineDosageSituation.addConsequentOf({ leftSide:'contract.remain.value._value', op:'<',  rightSide: 'contract.minQuantity', _type: 'Condition'}) 
          	   
          	  this.oRequestVaccineDosageSituation.addConsequentOf( {_type: 'stateCondition', resourceType:"obligation", resource: "oAgreedOnRequest", state:"fulfillment"} )
          	   
          	  this.oRequestVaccineDosageSituation.addConsequentOf( {_type: 'stateCondition', resourceType:"obligation", resource: "oDeliver", state:"fulfillment"} )
          	   
          	  this.oRequestVaccineDosageSituation.addConsequentOf( {_type: 'stateCondition', resourceType:"obligation", resource: "oAssign", state:"fulfillment"} )
          	   
          	  this.oRequestVaccineDosageSituation.addConsequentOf({_type: 'eventCondition', resource:"mcdcTerminateAgreement", resourceType:"TerminateAgreementG"} )
          	   
          	  this.oRequestVaccineDosageSituation.addConsequentOf({_type: 'eventCondition', resource:"pfizerTerminateAgreement", resourceType:"TerminateAgreementM"} )
        this.obligations.oRequestVaccineDosage = new Obligation('oRequestVaccineDosage', this.pfizer, this.mcdc, this, this.oRequestVaccineDosageSituation)
      
      this.survivingObligations.oWithdrewApproval = new Obligation('oWithdrewApproval', this.mcdc, this.pfizer, this,null, true)
      
    
this.accessPolicy.addRulee("grant", "read", this.vaccineDose, this.mcdc, this.pfizer)
this.accessPolicy.addRulee("grant", "read", this.vaccineDose.FDAapproval, this.worldcourier, this.pfizer)
this.accessPolicy.addRulee("grant", "read", this.delivered, this.mcdc, this.pfizer)
this.accessPolicy.addRulee("revoke", "write", this.temperature.value, this.pfizer, this.regulator)
this.accessPolicy.addRulee("revoke", "write", this.humidity.value, this.pfizer, this.regulator)
this.accessPolicy.addRulee("revoke", "write", this.shock.value, this.pfizer, this.regulator)
this.accessPolicy.addRulee("revoke", "write", this.lightExposure.value, this.pfizer, this.regulator)
this.accessPolicy.addRulee("revoke", "write", this.sealOpen.value, this.pfizer, this.regulator)
this.accessPolicy.addRulee("grant", "read", this.withdrewApproval, this.pfizer, this.fda)
 	}
}
  
  module.exports.VaccineProcurementC = VaccineProcurementC
