const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class NotifiedOfDelivery extends Event {
 	constructor(_name,performer,reqID, delD ) {
    super(performer)
    this._name = _name
    this._type = "NotifiedOfDelivery"
    this.reqID = new Attribute("reqID",reqID,_name)
    this.delD = new Attribute("delD",delD,_name)
  }
}

module.exports.NotifiedOfDelivery = NotifiedOfDelivery
