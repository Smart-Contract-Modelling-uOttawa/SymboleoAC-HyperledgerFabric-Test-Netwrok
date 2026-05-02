const { Event } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class InspectedQuality extends Event {
 	constructor(_name,performer,quantityFound, qualityFound, barFound ) {
    super(performer)
    this._name = _name
    this._type = "InspectedQuality"
    this.quantityFound = new Attribute("quantityFound",quantityFound,_name)
    this.qualityFound = new Attribute("qualityFound",qualityFound,_name)
    this.barFound = new Attribute("barFound",barFound,_name)
  }
}

module.exports.InspectedQuality = InspectedQuality
