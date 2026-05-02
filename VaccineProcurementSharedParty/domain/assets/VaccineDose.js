const { Asset } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");

class VaccineDose extends Asset {
  constructor(_name,price, FDAapproval, owner) {
    super(owner)
    this._name = _name
    this._type = "VaccineDose"
    this.owner=owner
    this.price = new Attribute("price",price,_name)
    this.FDAapproval = new Attribute("FDAapproval",FDAapproval,_name)
  }
}

module.exports.VaccineDose = VaccineDose
