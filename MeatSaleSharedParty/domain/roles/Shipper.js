const { Role } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");

class Shipper extends Role {
  constructor(_name,name, org, dept) {
    super()
    this._name = _name
    this._type = "Shipper"
    this.name = new Attribute("name",name,_name)
    this.org = new Attribute("org",org,_name)
    this.dept = new Attribute("dept",dept,_name)
  }
}

module.exports.Shipper = Shipper
