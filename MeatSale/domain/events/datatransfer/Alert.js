const { DataTransfer } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");
class Alert extends DataTransfer {
 	constructor(_name,performer,value, sensorTimestamp, condition, window, count ) {
    super(performer)
    this._name = _name
    this._type = "Alert"
    this.sensorId=_name+"_sensor_"+_name + "Rule" 
    this.value = new Attribute("value",value,_name)
    this.sensorTimestamp = new Attribute("sensorTimestamp",sensorTimestamp,_name)
    this.condition = new Attribute("condition",condition,_name)
    this.window = new Attribute("window",window,_name)
    this.count = new Attribute("count",count,_name)
  }
}

module.exports.Alert = Alert
