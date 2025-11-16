const { DataTransfer } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");

class Temperature extends DataTransfer {
 	constructor(_name,performer,sensorId,value,sensorTimestamp,condition, window,count) {
    super(performer)
    this._name = _name
    this._type = "Temperature"
    this.sensorId = new Attribute("sensorId",sensorId)
    this.value = new Attribute("value",value)
    this.sensorTimestamp = new Attribute("sensorTimestamp",sensorTimestamp)
    this.condition = new Attribute("condition",condition)
    this.window = new Attribute("window",window)
    this.count = new Attribute("count",count)
  }
}

module.exports.Temperature = Temperature
