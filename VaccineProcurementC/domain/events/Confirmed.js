const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Confirmed extends Event {
 	constructor(_name,performer,reqID, shipToLocation ) {
    super(performer)
    this._name = _name
    this._type = "Confirmed"
    this.reqID = new Attribute("reqID",reqID,_name)
    this.shipToLocation = new Attribute("shipToLocation",shipToLocation,_name)
  }
}

module.exports.Confirmed = Confirmed
