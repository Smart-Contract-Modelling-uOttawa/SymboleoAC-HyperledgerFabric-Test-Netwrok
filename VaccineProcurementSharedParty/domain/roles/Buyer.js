const { Role } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");

class Buyer extends Role {
  constructor(_name,name, warehouse, org, dept) {
    super()
    this._name = _name
    this._type = "Buyer"
    this.name = new Attribute("name",name,_name)
    this.warehouse = new Attribute("warehouse",warehouse,_name)
    this.org = new Attribute("org",org,_name)
    this.dept = new Attribute("dept",dept,_name)
  }
}

module.exports.Buyer = Buyer
