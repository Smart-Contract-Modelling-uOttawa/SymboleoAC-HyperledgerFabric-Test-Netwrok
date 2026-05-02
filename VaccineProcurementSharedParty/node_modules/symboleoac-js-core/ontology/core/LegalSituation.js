const { Situation } = require('./Situation.js');
const { Resource } = require('./Resource.js');


class LegalSituation extends Situation {
  constructor(aTime) {
    super(aTime);
    this.antecedentOf = [];
    this.consequentOf = [];
    this._type = "LegalSituation"

  }

  getAntecedentOf(index) {
    return this.antecedentOf[index];
  }

  getAntecedentOfAll() {
    return this.antecedentOf;
  }

  numberOfAntecedentOf() {
    return this.antecedentOf.length;
  }

  hasAntecedentOf() {
    return this.antecedentOf.length > 0;
  }

  indexOfAntecedentOf(aAntecedentOf) {
    const index = this.antecedentOf.findIndex((o) => o.equals(aAntecedentOf));
    return index;
  }

  getConsequentOf(index) {
    return this.consequentOf[index];
  }

  getConsequentOfAll() {
    return this.consequentOf;
  }

  numberOfConsequentOf() {
    return this.consequentOf.length;
  }

  hasConsequentOf() {
    return this.consequentOf.length > 0;
  }

  indexOfConsequentOf(arg) {
    const index = this.consequentOf.findIndex((o) => o.equals(arg));
    return index;
  }

  static minimumNumberOfAntecedentOf() {
    return 0;
  }
 
  //AC-modification in the thesis
  addAntecedentOf(arg) {
 
    let wasAdded = false;
    if (this.antecedentOf.find((obj) => obj === arg)) {
      return false;
    }
    
    if (!(typeof arg === 'undefined') && !(arg === null)){
      this.antecedentOf.push(arg);
      wasAdded = true;

    }
  
    return wasAdded;
  }

  removeAntecedentOf(aAntecedentOf) {
    let wasRemoved = false;
    if (!this.equals(aAntecedentOf.getAntecedent())) {
      const index = this.antecedentOf.findIndex((o) => o.equals(aAntecedentOf));
      this.antecedentOf.splice(index, 1);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  static minimumNumberOfConsequentOf() {
    return 0;
  }
  //AC-modification 
//return this._constraints.find(obj => obj.decision === aRule.decision && obj.permission === aRule.permission && obj.accessedResource === aRule.accessedResource && obj.accessedRole === aRule.accessedRole);  
  addConsequentOf(arg) {
    let wasAdded = false;
    if (this.consequentOf.find((obj) => obj === arg)) {
      return false;
    }
    
    if (!(typeof arg === 'undefined') && !(arg === null)){
      this.consequentOf.push(arg);
      wasAdded = true;

    }
  
    return wasAdded;
  }

  removeConsequentOf(arg) {
    let wasRemoved = false;
    if (!this.equals(arg.getConsequent())) {
      const index = this.consequentOf.findIndex((o) => o.equals(arg));
      this.consequentOf.splice(index, 1);
      wasRemoved = true;
    }
    return wasRemoved;
  }

  delete() {
    for (let i = this.antecedentOf.length; i > 0; i--) {
      const aAntecedentOf = this.antecedentOf[i - 1];
      aAntecedentOf.delete();
    }
    for (let i = this.consequentOf.length; i > 0; i--) {
      const aConsequentOf = this.consequentOf[i - 1];
      aConsequentOf.delete();
    }
    super.delete();
  }
}

module.exports.LegalSituation = LegalSituation;
