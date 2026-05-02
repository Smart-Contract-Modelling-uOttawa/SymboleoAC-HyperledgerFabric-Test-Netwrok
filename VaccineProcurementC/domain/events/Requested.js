const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Requested extends Event {
 	constructor(_name,performer,reqID, dosage, date ) {
    super(performer)
    this._name = _name
    this._type = "Requested"
    this.reqID = new Attribute("reqID",reqID,_name)
    this.dosage = new Attribute("dosage",dosage,_name)
    this.date = new Attribute("date",date,_name)
  }
}

module.exports.Requested = Requested
