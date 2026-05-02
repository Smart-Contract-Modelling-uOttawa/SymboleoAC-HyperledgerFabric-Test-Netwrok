const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Delivered extends Event {
 	constructor(_name,performer,reqID, dosage, delAddr, date ) {
    super(performer)
    this._name = _name
    this._type = "Delivered"
    this.reqID = new Attribute("reqID",reqID,_name)
    this.dosage = new Attribute("dosage",dosage,_name)
    this.delAddr = new Attribute("delAddr",delAddr,_name)
    this.date = new Attribute("date",date,_name)
  }
}

module.exports.Delivered = Delivered
