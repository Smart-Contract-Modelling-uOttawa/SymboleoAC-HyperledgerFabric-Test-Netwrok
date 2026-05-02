const { Role } = require("symboleoac-js-core");
const { Attribute } = require("symboleoac-js-core");

class Storage extends Role {
  constructor(_name,name, address, org, dept) {
    super()
    this._name = _name
    this._type = "Storage"
    this.name = new Attribute("name",name,_name)
    this.address = new Attribute("address",address,_name)
    this.org = new Attribute("org",org,_name)
    this.dept = new Attribute("dept",dept,_name)
  }
}

module.exports.Storage = Storage
