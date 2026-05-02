const { Role } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");

class Seller extends Role {
  constructor(_name,returnAddress, name, org, dept) {
    super()
    this._name = _name
    this._type = "Seller"
    this.returnAddress = new Attribute("returnAddress",returnAddress,_name)
    this.name = new Attribute("name",name,_name)
    this.org = new Attribute("org",org,_name)
    this.dept = new Attribute("dept",dept,_name)
  }
}

module.exports.Seller = Seller
