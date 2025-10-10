const { Event } = require("symboleoac-js-core");
//sofana
class Notified extends Event {
  constructor(_name, message) {
    super()
    this._name = _name
    this._type = 'Notified'
    //this.messageType = type || []
    this.message = message || []
    //this.recipient = recipient || []
    //this.timestamp = timestamp || []
  }
}
//recipient should be list of party with thier keys
module.exports.Notified = Notified
