const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Agreed extends Event {
 	constructor(_name,performer,reqID ) {
    super(performer)
    this._name = _name
    this._type = "Agreed"
    this.reqID = new Attribute("reqID",reqID,_name)
  }
}

module.exports.Agreed = Agreed
