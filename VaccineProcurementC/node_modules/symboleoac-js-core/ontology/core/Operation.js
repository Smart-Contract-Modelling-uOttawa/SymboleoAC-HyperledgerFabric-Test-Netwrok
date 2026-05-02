const { Resource } = require('./Resource.js');


class Operation extends Resource {
    constructor(...allController) {
        super(allController);
        this._performer = [];
    }

    getPerformer(index) {
        return this._performer[index];
    }

    getPerformer() {
        return Object.freeze(this._performer); // Similar to Collections.unmodifiableList in Java
    }

    numberOfPerformer() {
        return this._performer.length;
    }

    hasPerformer() {
        return this._performer.length > 0;
    }

    indexOfPerformer(aPerformer) {
        return this._performer.indexOf(aPerformer);
    }

  //AC
  //utlity function
  findPerformer(aPerformer){
    let isPerformer = false
  
    isPerformer = this._performer.some(obj => obj._name === aPerformer._name && obj._type === aPerformer._type)
    console.log(isPerformer); // true
   
      return isPerformer
  
  }

    static minimumNumberOfPerformer() {
        return 0;
    }

    addPerformer(aPerformer) {
        let wasAdded = false;
        if (!this._performer.includes(aPerformer)) {
            this._performer.push(aPerformer);
            if (aPerformer.indexOfPerformedOperation(this) !== -1) {
                wasAdded = true;
            } else {
                wasAdded = aPerformer.addPerformedOperation(this);
                if (!wasAdded) {
                    this._performer.pop();
                }
            }
        }
        return wasAdded;
    }

    removePerformer(aPerformer) {
        let wasRemoved = false;
        const index = this._performer.indexOf(aPerformer);
        if (index !== -1) {
            this._performer.splice(index, 1);
            if (aPerformer.indexOfPerformedOperation(this) === -1) {
                wasRemoved = true;
            } else {
                wasRemoved = aPerformer.removePerformedOperation(this);
                if (!wasRemoved) {
                    this._performer.splice(index, 0, aPerformer);
                }
            }
        }
        return wasRemoved;
    }

    addPerformerAt(aPerformer, index) {
        let wasAdded = false;
        if (this.addPerformer(aPerformer)) {
            index = Math.max(0, Math.min(index, this.numberOfPerformer() - 1));
            this._performer.splice(index, 0, this._performer.pop());
            wasAdded = true;
        }
        return wasAdded;
    }

    addOrMovePerformerAt(aPerformer, index) {
        let wasAdded = false;
        if (this._performer.includes(aPerformer)) {
            index = Math.max(0, Math.min(index, this.numberOfPerformer() - 1));
            this._performer.splice(index, 0, this._performer.splice(this._performer.indexOf(aPerformer), 1)[0]);
            wasAdded = true;
        } else {
            wasAdded = this.addPerformerAt(aPerformer, index);
        }
        return wasAdded;
    }

    delete() {
        const copyOfPerformer = [...this._performer];
        this._performer = [];
        copyOfPerformer.forEach(aPerformer => {
            aPerformer.removePerformedOperation(this);
        });
        super.delete();
    }
}

module.exports.Operation = Operation
