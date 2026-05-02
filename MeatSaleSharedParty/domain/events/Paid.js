const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Paid extends Event {
 	constructor(_name,performer,amount, currency, from, to, payDueDate ) {
    super(performer)
    this._name = _name
    this._type = "Paid"
    this.amount = new Attribute("amount",amount,_name)
    this.currency = new Attribute("currency",currency,_name)
    this.from = new Attribute("from",from,_name)
    this.to = new Attribute("to",to,_name)
    this.payDueDate = new Attribute("payDueDate",payDueDate,_name)
  }
}

module.exports.Paid = Paid
