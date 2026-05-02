const { Resource } = require('./Resource.js');

class StateTransition extends Resource {
    constructor() {
      this.transitions = [];
    }
  
    // Method to add a new transition tuple
    addTransition(fromState, toState, timePoint) {
      this.transitions.push({ fromState, toState, timePoint });
    }
  
    // Method to get all transitions
    getTransitions() {
      return this.transitions;
    }
  
    // a method to find transitions by fromState or toState
    findTransitionsByState(state, type = 'from') {
      if (type === 'from') {
        return this.transitions.filter(transition => transition.fromState === state);
      } else if (type === 'to') {
        return this.transitions.filter(transition => transition.toState === state);
      }
      return [];
    }
  }//end class

  module.exports.StateTransition = StateTransition;