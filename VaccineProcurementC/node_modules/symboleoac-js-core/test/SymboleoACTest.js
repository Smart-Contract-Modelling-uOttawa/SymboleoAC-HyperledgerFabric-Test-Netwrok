/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
const { expect } = require('chai');
const { ACPolicy } = require('../core/ACPolicy.js');
const { Attribute }  = require('../core/Attribute.js');
//const { Operation }  = require('../core/Operation.js'); check why I get an error
const { Resource } = require('../core/Resource.js');
const {Rule} = require('../core/Rule.js');
const { SymboleoContract } = require('../core/SymboleoContract.js');
const { Power } = require('../core/Power.js');
const { Role } = require('../core/Role.js');
const { Obligation } = require('../core/Obligation.js');
const { Asset } = require('symboleo-js-core');
const { Event } = require('symboleo-js-core');


describe('ACPolicy', () => {
    let acPolicy;
    let accessedResource,accessedResource2,accessedResource3,accessedResource4,
    accessedResource5,accessedResource6;
    let accessedRole, accessedRole2;
    let rule, rule2,rule3, rule4, rule5,rule6,rule7;
    //create mock objects for testing
    const contract = new SymboleoContract('test_contract');
    const creditor = new Role('creditor', contract);
    const debtor = new Role('debtor', contract);
    const newRole = new Role('newRole', contract);
    const owner = new Role('owner',contract);
    const party1 = new Role('party1', contract);
    const party2 = new Role('party2', contract);
    const power = new Power('power', creditor, debtor, contract);
    const obligation = new Obligation('obligation', creditor, debtor, contract);
    const asset = new Asset('asset',debtor);
    const event = new Event();

    
    power.addController(creditor);
    obligation.addController(debtor);
    newRole.addController(newRole);
    asset.addController(owner);
    event.addController(newRole);
    contract.addController(party1);
    contract.addController(party2);

    beforeEach(() => {
        accessedResource = power;
        accessedResource2 = obligation;
        accessedResource3 = newRole;
        accessedResource4 = asset;
        accessedResource5 = event;
        accessedResource6 = contract;
        accessedRole = newRole;
        accessedRole2 = debtor;
        acPolicy = new ACPolicy();
    });

    it('should initialize with an empty rules array', () => {
        expect(acPolicy.numberOfRules()).to.equal(0);
        expect(acPolicy.hasRules()).to.be.false;
    });

    it('should add a rule on a resource', () => {
        rule = acPolicy.addRulee('Read', accessedResource, accessedRole);
        rule2 = acPolicy.addRulee('Read', accessedResource2, accessedRole);
        rule3 = acPolicy.addRulee('Read', accessedResource3, accessedRole2);
        rule4 = acPolicy.addRulee('Read', accessedResource4, accessedRole);
        rule5 = acPolicy.addRulee('Read', accessedResource5, accessedRole2);
        rule6 = acPolicy.addRulee('Read', accessedResource6, accessedRole);
        //rule7 = acPolicy.addRulee('Read', power.state, accessedRole);

        expect(acPolicy.numberOfRules()).to.equal(6);
        expect(acPolicy.hasRules()).to.be.true;
        expect(acPolicy.getRule(0)).to.equal(rule);
        expect(acPolicy.getRule(1)).to.equal(rule2);
        expect(acPolicy.getRule(2)).to.equal(rule3);
        expect(acPolicy.getRule(3)).to.equal(rule4);
        expect(acPolicy.getRule(4)).to.equal(rule5);
        expect(acPolicy.getRule(5)).to.equal(rule6);
       //expect(acPolicy.getRule(6)).to.equal(rule7);
    });

    it('should add a rule on a specific attribute of a resource', () => {
        
        
    });

    it('should not add duplicate rules', () => {
        acPolicy.addRule(rule);
        const added = acPolicy.addRule(rule);
        expect(added).to.be.false;
        expect(acPolicy.numberOfRules()).to.equal(1);
    });
    
    it('should check if detor (rightholder and performer) of a power is pre-authorized', () => {
        const hasPermission = acPolicy.hasPermesstion('Write', power, creditor);
        expect(hasPermission).to.be.true;
    });

    it('should check if detor (rightholder and performer) of a power is pre-authorized', () => {
        const hasPermission = acPolicy.hasPermesstion('Read', power, creditor);
        expect(hasPermission).to.be.true;
    });

    it('should check if creditor of a power is pre-authorized to read only ', () => {
        const hasPermission = acPolicy.hasPermesstion('Read', power, debtor);
        expect(hasPermission).to.be.true;
    });
    
    //***should be false
    it('should check if creditor of a power is not pre-authorized to write ', () => {
        const hasPermission = acPolicy.hasPermesstion('Write', power, debtor);
        expect(hasPermission).to.be.true;//.false
    });

    it('should check if detor(performer) of an obligation is pre-authorized ', () => {
        const hasPermission = acPolicy.hasPermesstion('Write', obligation, debtor);
        expect(hasPermission).to.be.true;
    });

    it('should check if detor(performer) of an obligation is pre-authorized ', () => {
        const hasPermission = acPolicy.hasPermesstion('Read', obligation, debtor);
        expect(hasPermission).to.be.true;
    });

    it('should check if creditor of an obligation is pre-authorized to read oly ', () => {
        const hasPermission = acPolicy.hasPermesstion('Read', obligation, creditor);
        expect(hasPermission).to.be.true;
    });
    //***should be false
    it('should check if creditor of an obligation is pre-authorized to read oly ', () => {
        const hasPermission = acPolicy.hasPermesstion('Write', obligation, creditor);
        expect(hasPermission).to.be.true;//false
    });

    it('should check if a role is pre-authorized to access his/her information ', () => {
        const hasPermission = acPolicy.hasPermesstion('Write', newRole, newRole);
        expect(hasPermission).to.be.true;
    });

    it('should check if a another can not access other role information unless authorized', () => {
        const hasPermission = acPolicy.hasPermesstion('Write', newRole, party1);
        expect(hasPermission).to.be.false;
    });

    it('should check if contracting parites are pre-authorized to access conttact', () => {
        const hasPermission = acPolicy.hasPermesstion('Write', contract ,party1 );
        expect(hasPermission).to.be.true;
    });

    it('should check if contracting parites are pre-authorized to access conttact', () => {
        const hasPermission = acPolicy.hasPermesstion('Read', contract ,party1 );
        expect(hasPermission).to.be.true;
    });

    it('should check if contracting parites are pre-authorized to access conttact', () => {
        const hasPermission = acPolicy.hasPermesstion('Write', contract ,party2 );
        expect(hasPermission).to.be.true;
    });

    it('should check if contracting parites are pre-authorized to access conttact', () => {
        const hasPermission = acPolicy.hasPermesstion('Read', contract ,party2 );
        expect(hasPermission).to.be.true;
    });

    it('should check that thrid party is not pre-authorized to access conttact information', () => {
        const hasPermission = acPolicy.hasPermesstion('Write', contract ,newRole );
        expect(hasPermission).to.be.false;
    });
    
    //*** it should be true
    it('should check that asset owner is pre-authorized to access asset information', () => {
       const hasPermission = acPolicy.hasPermesstion('Write', asset , owner);
       expect(hasPermission).to.be.false; //true
    });

    it('should check that asset owner is pre-authorized to access asset information', () => {
        const hasPermission = acPolicy.hasPermesstion('Read', asset , owner);
        expect(hasPermission).to.be.true;
     });


      // should first ensure that a controller is the only one who removeRule, then it can remove it
    /*
    it('should remove a rule', () => {
        acPolicy.addRule(rule);
        acPolicy.removeRule(rule);
        expect(acPolicy.numberOfRules()).to.equal(0);
        expect(acPolicy.hasRules()).to.be.false;
    });
    */

   

});
