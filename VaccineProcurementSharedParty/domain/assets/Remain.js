const { Asset } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");

class Remain extends Asset {
  constructor(_name,value, owner) {
    super(owner)
    this._name = _name
    this._type = "Remain"
    this.owner=owner
    this.value = new Attribute("value",value,_name)
  }
}

module.exports.Remain = Remain
