const { Resource } = require('./Resource.js');

class AbstractEvent extends Resource{
    constructor(allControllers) {
          super(allControllers)
          this.attributes = [];
          //this.super(allControllers);
          
        }

}

module.exports.AbstractEvent = AbstractEvent;
