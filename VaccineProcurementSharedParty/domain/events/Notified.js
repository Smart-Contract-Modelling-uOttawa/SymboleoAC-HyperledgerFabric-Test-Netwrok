const { Event } = require("symboleoac-js-core");
class Notified extends Event {
  constructor(_name, message) {
    super()
    this._name = _name
    this._type = 'Notified'
    this.message = message || []
  }
}
module.exports.Notified = Notified
