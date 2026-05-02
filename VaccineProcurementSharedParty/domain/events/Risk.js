const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Risk extends Event {
 	constructor(_name,performer,reqID, extendedDel ) {
    super(performer)
    this._name = _name
    this._type = "Risk"
    this.reqID = new Attribute("reqID",reqID,_name)
    this.extendedDel = new Attribute("extendedDel",extendedDel,_name)
  }
}

module.exports.Risk = Risk
