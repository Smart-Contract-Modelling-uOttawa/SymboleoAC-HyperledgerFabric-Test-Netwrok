const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Delivered extends Event {
 	constructor(_name,performer,deliveryAddress, delDueDate ) {
    super(performer)
    this._name = _name
    this._type = "Delivered"
    this.deliveryAddress = new Attribute("deliveryAddress",deliveryAddress,_name)
    this.delDueDate = new Attribute("delDueDate",delDueDate,_name)
  }
}

module.exports.Delivered = Delivered
