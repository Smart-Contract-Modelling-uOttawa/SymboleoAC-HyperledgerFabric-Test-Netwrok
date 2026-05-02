const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Invoiced extends Event {
 	constructor(_name,performer,reqID, noOfDoses, date ) {
    super(performer)
    this._name = _name
    this._type = "Invoiced"
    this.reqID = new Attribute("reqID",reqID,_name)
    this.noOfDoses = new Attribute("noOfDoses",noOfDoses,_name)
    this.date = new Attribute("date",date,_name)
  }
}

module.exports.Invoiced = Invoiced
