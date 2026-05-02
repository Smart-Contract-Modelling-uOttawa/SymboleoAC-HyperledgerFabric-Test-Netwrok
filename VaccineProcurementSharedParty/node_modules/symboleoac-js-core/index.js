/*

const utils = require('./Utils.js');
const internalEvents = require('./core/InternalEvents.js');
const power = require('./core/Power.js');
const obligation = require('./core/Obligation.js');
const symboleoContract = require('./core/SymboleoContract.js');
//AC-flatted librabry
const {stringify, parse } = require('flatted');
module.exports.parse = require('flatted');
module.exports.stringify = require('flatted');

module.exports.Asset = require('./core/Asset.js').Asset;
module.exports.Event = require('./core/Event.js').Event;
module.exports.LegalPosition = require('./core/LegalPosition.js').LegalPosition;
module.exports.LegalSituation = require('./core/LegalSituation.js').LegalSituation;
module.exports.Situation = require('./core/Situation.js').Situation;
module.exports.Party = require('./core/Party.js').Party;
module.exports.Role = require('./core/Role.js').Role;
module.exports.Predicates = require('./core/Predicates.js').Predicates;
module.exports.Events = require('./Events.js').Events;
module.exports.Resource = require('./core/Predicates.js').Resource;


module.exports.Power = power.Power;
module.exports.PowerState = power.PowerState;
module.exports.PowerActiveState = power.PowerActiveState;

module.exports.Obligation = obligation.Obligation;
module.exports.ObligationState = obligation.ObligationState;
module.exports.ObligationActiveState = obligation.ObligationActiveState;

module.exports.SymboleoContract = symboleoContract.SymboleoContract;
module.exports.ContractState = symboleoContract.ContractState;
module.exports.ContractActiveState = symboleoContract.ContractActiveState;

module.exports.InternalEvent = internalEvents.InternalEvent;
module.exports.InternalEventSource = internalEvents.InternalEventSource;
module.exports.InternalEventType = internalEvents.InternalEventType;

module.exports.Utils = utils.Utils;
module.exports.Str = utils.Str;
*/


/*
const utils = require('./Utils.js');
const internalEvents = require('./ontology/core/InternalEvents.js');
const power = require('./ontology/core/Power.js');
const obligation = require('./ontology/core/Obligation.js');
const symboleoContract = require('./ontology/core/SymboleoContract.js');
//AC-flatted librabry
const {stringify, parse } = require('flatted');
module.exports.parse = require('flatted');
module.exports.stringify = require('flatted');

module.exports.Asset = require('./ontology/core/Asset.js').Asset;
module.exports.Event = require('./ontology/core/Event.js').Event;
module.exports.LegalPosition = require('./ontology/core/LegalPosition.js').LegalPosition;
module.exports.LegalSituation = require('./ontology/core/LegalSituation.js').LegalSituation;
module.exports.Situation = require('./ontology/core/Situation.js').Situation;
module.exports.Party = require('./ontology/core/Party.js').Party;
module.exports.Role = require('./ontology/core/Role.js').Role;
module.exports.Predicates = require('./ontology/core/Predicates.js').Predicates;
module.exports.Events = require('./Events.js').Events;
//AC
module.exports.Resource = require('./ontology/core/Predicates.js').Resource;
module.exports.AbstractEvent = require('./ontology/core/AbstractEvent.js').AbstractEvent;
module.exports.ACPolicy = require('./ontology/core/ACPolicy.js').ACPolicy;
module.exports.Attribute = require('./ontology/core/Attribute.js').Attribute;
module.exports.Data = require('./ontology/core/Data.js').Data;
module.exports.Operation = require('./ontology/core/Operation.js').Operation;
module.exports.StateTransition = require('./ontology/core/StateTransition.js').StateTransition;
module.exports.Rule = require('./ontology/core/Rule.js').Rule;

module.exports.Power = power.Power;
module.exports.PowerState = power.PowerState;
module.exports.PowerActiveState = power.PowerActiveState;

module.exports.Obligation = obligation.Obligation;
module.exports.ObligationState = obligation.ObligationState;
module.exports.ObligationActiveState = obligation.ObligationActiveState;

module.exports.SymboleoContract = symboleoContract.SymboleoContract;
module.exports.ContractState = symboleoContract.ContractState;
module.exports.ContractActiveState = symboleoContract.ContractActiveState;

module.exports.InternalEvent = internalEvents.InternalEvent;
module.exports.InternalEventSource = internalEvents.InternalEventSource;
module.exports.InternalEventType = internalEvents.InternalEventType;

module.exports.Utils = utils.Utils;
module.exports.Str = utils.Str;
*/
// Internal imports
const utils = require('./Utils.js');
const internalEvents = require('./ontology/core/InternalEvents.js');
const power = require('./ontology/core/Power.js');
const obligation = require('./ontology/core/Obligation.js');
const symboleoContract = require('./ontology/core/SymboleoContract.js');

// flatted
const { stringify, parse } = require('flatted');
module.exports.stringify = stringify;
module.exports.parse = parse;

// Core ontology classes
module.exports.Asset = require('./ontology/core/Asset.js').Asset;
module.exports.Event = require('./ontology/core/Event.js').Event;
module.exports.LegalPosition = require('./ontology/core/LegalPosition.js').LegalPosition;
module.exports.LegalSituation = require('./ontology/core/LegalSituation.js').LegalSituation;
module.exports.Situation = require('./ontology/core/Situation.js').Situation;
module.exports.Party = require('./ontology/core/Party.js').Party;
module.exports.Role = require('./ontology/core/Role.js').Role;
module.exports.Predicates = require('./ontology/core/Predicates.js').Predicates;
module.exports.Resource = require('./ontology/core/Predicates.js').Resource;
module.exports.Events = require('./Events.js').Events;

// Access Control components
module.exports.AbstractEvent = require('./ontology/core/AbstractEvent.js').AbstractEvent;
module.exports.ACPolicy = require('./ontology/core/ACPolicy.js').ACPolicy;
module.exports.Attribute = require('./ontology/core/Attribute.js').Attribute;
module.exports.DataTransfer = require('./ontology/core/DataTransfer.js').DataTransfer;
module.exports.Operation = require('./ontology/core/Operation.js').Operation;
module.exports.StateTransition = require('./ontology/core/StateTransition.js').StateTransition;
module.exports.Rule = require('./ontology/core/Rule.js').Rule;

// From Power.js
module.exports.Power = power.Power;
module.exports.PowerState = power.PowerState;
module.exports.PowerActiveState = power.PowerActiveState;

// From Obligation.js
module.exports.Obligation = obligation.Obligation;
module.exports.ObligationState = obligation.ObligationState;
module.exports.ObligationActiveState = obligation.ObligationActiveState;

// From SymboleoContract.js
module.exports.SymboleoContract = symboleoContract.SymboleoContract;
module.exports.ContractState = symboleoContract.ContractState;
module.exports.ContractActiveState = symboleoContract.ContractActiveState;

// From InternalEvents.js
module.exports.InternalEvent = internalEvents.InternalEvent;
module.exports.InternalEventSource = internalEvents.InternalEventSource;
module.exports.InternalEventType = internalEvents.InternalEventType;

// Utils
module.exports.Utils = utils.Utils;
module.exports.Str = utils.Str;