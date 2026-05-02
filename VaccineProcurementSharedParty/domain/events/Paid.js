const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Paid extends Event {
 	constructor(_name,performer,reqID, amount ) {
    super(performer)
    this._name = _name
    this._type = "Paid"
    this.reqID = new Attribute("reqID",reqID,_name)
    this.amount = new Attribute("amount",amount,_name)
  }
}

module.exports.Paid = Paid
