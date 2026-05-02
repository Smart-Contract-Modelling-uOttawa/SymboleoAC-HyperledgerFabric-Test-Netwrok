/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

// line 42 "model.ump"
// line 265 "model.ump"
public class Role extends Resource
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Role Associations
  private List<LegalPosition> debt;
  private List<LegalPosition> credit;
  private Party party;
  private Contract contract;
  private List<Event> performedEvent;
  private List<Resource> controlledResource;
  private Rule ruleAccesseor;
  private List<Operation> performedOperation;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Role(Contract aContract, Role... allControllers)
  {
    super(allControllers);
    debt = new ArrayList<LegalPosition>();
    credit = new ArrayList<LegalPosition>();
    boolean didAddContract = setContract(aContract);
    if (!didAddContract)
    {
      throw new RuntimeException("Unable to create role due to contract. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    performedEvent = new ArrayList<Event>();
    controlledResource = new ArrayList<Resource>();
    performedOperation = new ArrayList<Operation>();
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetMany */
  public LegalPosition getDebt(int index)
  {
    LegalPosition aDebt = debt.get(index);
    return aDebt;
  }

  public List<LegalPosition> getDebt()
  {
    List<LegalPosition> newDebt = Collections.unmodifiableList(debt);
    return newDebt;
  }

  public int numberOfDebt()
  {
    int number = debt.size();
    return number;
  }

  public boolean hasDebt()
  {
    boolean has = debt.size() > 0;
    return has;
  }

  public int indexOfDebt(LegalPosition aDebt)
  {
    int index = debt.indexOf(aDebt);
    return index;
  }
  /* Code from template association_GetMany */
  public LegalPosition getCredit(int index)
  {
    LegalPosition aCredit = credit.get(index);
    return aCredit;
  }

  public List<LegalPosition> getCredit()
  {
    List<LegalPosition> newCredit = Collections.unmodifiableList(credit);
    return newCredit;
  }

  public int numberOfCredit()
  {
    int number = credit.size();
    return number;
  }

  public boolean hasCredit()
  {
    boolean has = credit.size() > 0;
    return has;
  }

  public int indexOfCredit(LegalPosition aCredit)
  {
    int index = credit.indexOf(aCredit);
    return index;
  }
  /* Code from template association_GetOne */
  public Party getParty()
  {
    return party;
  }

  public boolean hasParty()
  {
    boolean has = party != null;
    return has;
  }
  /* Code from template association_GetOne */
  public Contract getContract()
  {
    return contract;
  }
  /* Code from template association_GetMany */
  public Event getPerformedEvent(int index)
  {
    Event aPerformedEvent = performedEvent.get(index);
    return aPerformedEvent;
  }

  public List<Event> getPerformedEvent()
  {
    List<Event> newPerformedEvent = Collections.unmodifiableList(performedEvent);
    return newPerformedEvent;
  }

  public int numberOfPerformedEvent()
  {
    int number = performedEvent.size();
    return number;
  }

  public boolean hasPerformedEvent()
  {
    boolean has = performedEvent.size() > 0;
    return has;
  }

  public int indexOfPerformedEvent(Event aPerformedEvent)
  {
    int index = performedEvent.indexOf(aPerformedEvent);
    return index;
  }
  /* Code from template association_GetMany */
  public Resource getControlledResource(int index)
  {
    Resource aControlledResource = controlledResource.get(index);
    return aControlledResource;
  }

  public List<Resource> getControlledResource()
  {
    List<Resource> newControlledResource = Collections.unmodifiableList(controlledResource);
    return newControlledResource;
  }

  public int numberOfControlledResource()
  {
    int number = controlledResource.size();
    return number;
  }

  public boolean hasControlledResource()
  {
    boolean has = controlledResource.size() > 0;
    return has;
  }

  public int indexOfControlledResource(Resource aControlledResource)
  {
    int index = controlledResource.indexOf(aControlledResource);
    return index;
  }
  /* Code from template association_GetOne */
  public Rule getRuleAccesseor()
  {
    return ruleAccesseor;
  }

  public boolean hasRuleAccesseor()
  {
    boolean has = ruleAccesseor != null;
    return has;
  }
  /* Code from template association_GetMany */
  public Operation getPerformedOperation(int index)
  {
    Operation aPerformedOperation = performedOperation.get(index);
    return aPerformedOperation;
  }

  public List<Operation> getPerformedOperation()
  {
    List<Operation> newPerformedOperation = Collections.unmodifiableList(performedOperation);
    return newPerformedOperation;
  }

  public int numberOfPerformedOperation()
  {
    int number = performedOperation.size();
    return number;
  }

  public boolean hasPerformedOperation()
  {
    boolean has = performedOperation.size() > 0;
    return has;
  }

  public int indexOfPerformedOperation(Operation aPerformedOperation)
  {
    int index = performedOperation.indexOf(aPerformedOperation);
    return index;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfDebt()
  {
    return 0;
  }
  /* Code from template association_AddManyToOne */
  public LegalPosition addDebt(LegalSituation aAntecedent, LegalSituation aConsequent, StateTransition aStateTransition, Contract aContract, Role aCreditor, Role... allControllers)
  {
    return new LegalPosition(aAntecedent, aConsequent, aStateTransition, aContract, this, aCreditor, allControllers);
  }

  public boolean addDebt(LegalPosition aDebt)
  {
    boolean wasAdded = false;
    if (debt.contains(aDebt)) { return false; }
    Role existingDebtor = aDebt.getDebtor();
    boolean isNewDebtor = existingDebtor != null && !this.equals(existingDebtor);
    if (isNewDebtor)
    {
      aDebt.setDebtor(this);
    }
    else
    {
      debt.add(aDebt);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeDebt(LegalPosition aDebt)
  {
    boolean wasRemoved = false;
    //Unable to remove aDebt, as it must always have a debtor
    if (!this.equals(aDebt.getDebtor()))
    {
      debt.remove(aDebt);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addDebtAt(LegalPosition aDebt, int index)
  {  
    boolean wasAdded = false;
    if(addDebt(aDebt))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfDebt()) { index = numberOfDebt() - 1; }
      debt.remove(aDebt);
      debt.add(index, aDebt);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveDebtAt(LegalPosition aDebt, int index)
  {
    boolean wasAdded = false;
    if(debt.contains(aDebt))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfDebt()) { index = numberOfDebt() - 1; }
      debt.remove(aDebt);
      debt.add(index, aDebt);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addDebtAt(aDebt, index);
    }
    return wasAdded;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfCredit()
  {
    return 0;
  }
  /* Code from template association_AddManyToOne */
  public LegalPosition addCredit(LegalSituation aAntecedent, LegalSituation aConsequent, StateTransition aStateTransition, Contract aContract, Role aDebtor, Role... allControllers)
  {
    return new LegalPosition(aAntecedent, aConsequent, aStateTransition, aContract, aDebtor, this, allControllers);
  }

  public boolean addCredit(LegalPosition aCredit)
  {
    boolean wasAdded = false;
    if (credit.contains(aCredit)) { return false; }
    Role existingCreditor = aCredit.getCreditor();
    boolean isNewCreditor = existingCreditor != null && !this.equals(existingCreditor);
    if (isNewCreditor)
    {
      aCredit.setCreditor(this);
    }
    else
    {
      credit.add(aCredit);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeCredit(LegalPosition aCredit)
  {
    boolean wasRemoved = false;
    //Unable to remove aCredit, as it must always have a creditor
    if (!this.equals(aCredit.getCreditor()))
    {
      credit.remove(aCredit);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addCreditAt(LegalPosition aCredit, int index)
  {  
    boolean wasAdded = false;
    if(addCredit(aCredit))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfCredit()) { index = numberOfCredit() - 1; }
      credit.remove(aCredit);
      credit.add(index, aCredit);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveCreditAt(LegalPosition aCredit, int index)
  {
    boolean wasAdded = false;
    if(credit.contains(aCredit))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfCredit()) { index = numberOfCredit() - 1; }
      credit.remove(aCredit);
      credit.add(index, aCredit);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addCreditAt(aCredit, index);
    }
    return wasAdded;
  }
  /* Code from template association_SetOptionalOneToMandatoryMany */
  public boolean setParty(Party aParty)
  {
    //
    // This source of this source generation is association_SetOptionalOneToMandatoryMany.jet
    // This set file assumes the generation of a maximumNumberOfXXX method does not exist because 
    // it's not required (No upper bound)
    //   
    boolean wasSet = false;
    Party existingParty = party;

    if (existingParty == null)
    {
      if (aParty != null)
      {
        if (aParty.addRole(this))
        {
          existingParty = aParty;
          wasSet = true;
        }
      }
    } 
    else if (existingParty != null)
    {
      if (aParty == null)
      {
        if (existingParty.minimumNumberOfRoles() < existingParty.numberOfRoles())
        {
          existingParty.removeRole(this);
          existingParty = aParty;  // aParty == null
          wasSet = true;
        }
      } 
      else
      {
        if (existingParty.minimumNumberOfRoles() < existingParty.numberOfRoles())
        {
          existingParty.removeRole(this);
          aParty.addRole(this);
          existingParty = aParty;
          wasSet = true;
        }
      }
    }
    if (wasSet)
    {
      party = existingParty;
    }
    return wasSet;
  }
    /* Code from template association_SetOneToMandatoryMany */
  public boolean setContract(Contract aContract)
  {
    boolean wasSet = false;
    //Must provide contract to role
    if (aContract == null)
    {
      return wasSet;
    }

    if (contract != null && contract.numberOfRoles() <= Contract.minimumNumberOfRoles())
    {
      return wasSet;
    }

    Contract existingContract = contract;
    contract = aContract;
    if (existingContract != null && !existingContract.equals(aContract))
    {
      boolean didRemove = existingContract.removeRole(this);
      if (!didRemove)
      {
        contract = existingContract;
        return wasSet;
      }
    }
    contract.addRole(this);
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfPerformedEvent()
  {
    return 0;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addPerformedEvent(Event aPerformedEvent)
  {
    boolean wasAdded = false;
    if (performedEvent.contains(aPerformedEvent)) { return false; }
    performedEvent.add(aPerformedEvent);
    if (aPerformedEvent.indexOfPerformer(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aPerformedEvent.addPerformer(this);
      if (!wasAdded)
      {
        performedEvent.remove(aPerformedEvent);
      }
    }
    return wasAdded;
  }
  /* Code from template association_RemoveMany */
  public boolean removePerformedEvent(Event aPerformedEvent)
  {
    boolean wasRemoved = false;
    if (!performedEvent.contains(aPerformedEvent))
    {
      return wasRemoved;
    }

    int oldIndex = performedEvent.indexOf(aPerformedEvent);
    performedEvent.remove(oldIndex);
    if (aPerformedEvent.indexOfPerformer(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aPerformedEvent.removePerformer(this);
      if (!wasRemoved)
      {
        performedEvent.add(oldIndex,aPerformedEvent);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addPerformedEventAt(Event aPerformedEvent, int index)
  {  
    boolean wasAdded = false;
    if(addPerformedEvent(aPerformedEvent))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfPerformedEvent()) { index = numberOfPerformedEvent() - 1; }
      performedEvent.remove(aPerformedEvent);
      performedEvent.add(index, aPerformedEvent);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMovePerformedEventAt(Event aPerformedEvent, int index)
  {
    boolean wasAdded = false;
    if(performedEvent.contains(aPerformedEvent))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfPerformedEvent()) { index = numberOfPerformedEvent() - 1; }
      performedEvent.remove(aPerformedEvent);
      performedEvent.add(index, aPerformedEvent);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addPerformedEventAt(aPerformedEvent, index);
    }
    return wasAdded;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfControlledResource()
  {
    return 0;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addControlledResource(Resource aControlledResource)
  {
    boolean wasAdded = false;
    if (controlledResource.contains(aControlledResource)) { return false; }
    controlledResource.add(aControlledResource);
    if (aControlledResource.indexOfController(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aControlledResource.addController(this);
      if (!wasAdded)
      {
        controlledResource.remove(aControlledResource);
      }
    }
    return wasAdded;
  }
  /* Code from template association_RemoveMany */
  public boolean removeControlledResource(Resource aControlledResource)
  {
    boolean wasRemoved = false;
    if (!controlledResource.contains(aControlledResource))
    {
      return wasRemoved;
    }

    int oldIndex = controlledResource.indexOf(aControlledResource);
    controlledResource.remove(oldIndex);
    if (aControlledResource.indexOfController(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aControlledResource.removeController(this);
      if (!wasRemoved)
      {
        controlledResource.add(oldIndex,aControlledResource);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addControlledResourceAt(Resource aControlledResource, int index)
  {  
    boolean wasAdded = false;
    if(addControlledResource(aControlledResource))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfControlledResource()) { index = numberOfControlledResource() - 1; }
      controlledResource.remove(aControlledResource);
      controlledResource.add(index, aControlledResource);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveControlledResourceAt(Resource aControlledResource, int index)
  {
    boolean wasAdded = false;
    if(controlledResource.contains(aControlledResource))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfControlledResource()) { index = numberOfControlledResource() - 1; }
      controlledResource.remove(aControlledResource);
      controlledResource.add(index, aControlledResource);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addControlledResourceAt(aControlledResource, index);
    }
    return wasAdded;
  }
  /* Code from template association_SetOptionalOneToOne */
  public boolean setRuleAccesseor(Rule aNewRuleAccesseor)
  {
    boolean wasSet = false;
    if (ruleAccesseor != null && !ruleAccesseor.equals(aNewRuleAccesseor) && equals(ruleAccesseor.getAccessedRole()))
    {
      //Unable to setRuleAccesseor, as existing ruleAccesseor would become an orphan
      return wasSet;
    }

    ruleAccesseor = aNewRuleAccesseor;
    Role anOldAccessedRole = aNewRuleAccesseor != null ? aNewRuleAccesseor.getAccessedRole() : null;

    if (!this.equals(anOldAccessedRole))
    {
      if (anOldAccessedRole != null)
      {
        anOldAccessedRole.ruleAccesseor = null;
      }
      if (ruleAccesseor != null)
      {
        ruleAccesseor.setAccessedRole(this);
      }
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfPerformedOperation()
  {
    return 0;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addPerformedOperation(Operation aPerformedOperation)
  {
    boolean wasAdded = false;
    if (performedOperation.contains(aPerformedOperation)) { return false; }
    performedOperation.add(aPerformedOperation);
    if (aPerformedOperation.indexOfPerformer(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aPerformedOperation.addPerformer(this);
      if (!wasAdded)
      {
        performedOperation.remove(aPerformedOperation);
      }
    }
    return wasAdded;
  }
  /* Code from template association_RemoveMany */
  public boolean removePerformedOperation(Operation aPerformedOperation)
  {
    boolean wasRemoved = false;
    if (!performedOperation.contains(aPerformedOperation))
    {
      return wasRemoved;
    }

    int oldIndex = performedOperation.indexOf(aPerformedOperation);
    performedOperation.remove(oldIndex);
    if (aPerformedOperation.indexOfPerformer(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aPerformedOperation.removePerformer(this);
      if (!wasRemoved)
      {
        performedOperation.add(oldIndex,aPerformedOperation);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addPerformedOperationAt(Operation aPerformedOperation, int index)
  {  
    boolean wasAdded = false;
    if(addPerformedOperation(aPerformedOperation))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfPerformedOperation()) { index = numberOfPerformedOperation() - 1; }
      performedOperation.remove(aPerformedOperation);
      performedOperation.add(index, aPerformedOperation);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMovePerformedOperationAt(Operation aPerformedOperation, int index)
  {
    boolean wasAdded = false;
    if(performedOperation.contains(aPerformedOperation))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfPerformedOperation()) { index = numberOfPerformedOperation() - 1; }
      performedOperation.remove(aPerformedOperation);
      performedOperation.add(index, aPerformedOperation);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addPerformedOperationAt(aPerformedOperation, index);
    }
    return wasAdded;
  }

  public void delete()
  {
    for(int i=debt.size(); i > 0; i--)
    {
      LegalPosition aDebt = debt.get(i - 1);
      aDebt.delete();
    }
    for(int i=credit.size(); i > 0; i--)
    {
      LegalPosition aCredit = credit.get(i - 1);
      aCredit.delete();
    }
    if (party != null)
    {
      if (party.numberOfRoles() <= 1)
      {
        party.delete();
      }
      else
      {
        Party placeholderParty = party;
        this.party = null;
        placeholderParty.removeRole(this);
      }
    }
    Contract placeholderContract = contract;
    this.contract = null;
    if(placeholderContract != null)
    {
      placeholderContract.removeRole(this);
    }
    ArrayList<Event> copyOfPerformedEvent = new ArrayList<Event>(performedEvent);
    performedEvent.clear();
    for(Event aPerformedEvent : copyOfPerformedEvent)
    {
      aPerformedEvent.removePerformer(this);
    }
    ArrayList<Resource> copyOfControlledResource = new ArrayList<Resource>(controlledResource);
    controlledResource.clear();
    for(Resource aControlledResource : copyOfControlledResource)
    {
      if (aControlledResource.numberOfControllers() <= Resource.minimumNumberOfControllers())
      {
        aControlledResource.delete();
      }
      else
      {
        aControlledResource.removeController(this);
      }
    }
    Rule existingRuleAccesseor = ruleAccesseor;
    ruleAccesseor = null;
    if (existingRuleAccesseor != null)
    {
      existingRuleAccesseor.delete();
    }
    ArrayList<Operation> copyOfPerformedOperation = new ArrayList<Operation>(performedOperation);
    performedOperation.clear();
    for(Operation aPerformedOperation : copyOfPerformedOperation)
    {
      aPerformedOperation.removePerformer(this);
    }
    super.delete();
  }

}