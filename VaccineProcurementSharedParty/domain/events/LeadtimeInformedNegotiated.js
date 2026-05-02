const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class LeadtimeInformedNegotiated extends Event {
 	constructor(_name,performer,reqID, date ) {
    super(performer)
    this._name = _name
    this._type = "LeadtimeInformedNegotiated"
    this.reqID = new Attribute("reqID",reqID,_name)
    this.date = new Attribute("date",date,_name)
  }
}

module.exports.LeadtimeInformedNegotiated = LeadtimeInformedNegotiated
