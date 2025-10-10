const { Role } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");

class Seller extends Role {
  constructor(_name,returnAddress, name, org, dept) {
    super()
    this._name = _name
    this._type = "Seller"
    this.returnAddress = new Attribute("returnAddress",returnAddress)
    this.name = new Attribute("name",name)
    //** */
    this.org = new Attribute("org",org)
    this.dept = new Attribute("dept",dept)
  }
}

module.exports.Seller = Seller
