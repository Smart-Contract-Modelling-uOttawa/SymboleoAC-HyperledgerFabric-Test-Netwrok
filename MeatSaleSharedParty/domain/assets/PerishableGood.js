const { Asset } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");

class PerishableGood extends Asset {
  constructor(_name,quantity, quality, barcode, owner) {
    super(owner)
    this._name = _name
    this._type = "PerishableGood"
    this.owner=owner
    this.quantity = new Attribute("quantity",quantity,_name)
    this.quality = new Attribute("quality",quality,_name)
    this.barcode = new Attribute("barcode",barcode,_name)
  }
}

module.exports.PerishableGood = PerishableGood
