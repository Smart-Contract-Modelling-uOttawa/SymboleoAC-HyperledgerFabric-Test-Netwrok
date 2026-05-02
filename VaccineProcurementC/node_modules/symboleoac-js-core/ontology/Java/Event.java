/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

// line 83 "model.ump"
// line 290 "model.ump"
public class Event extends AbstractEvent
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Event Associations
  private TimePoint time;
  private List<Role> performer;
  private List<LegalPosition> legalPositionSE;
  private Situation postState;
  private Situation preState;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Event(Role[] allControllers, Attribute[] allAttributes, TimePoint aTime, LegalPosition[] allLegalPositionSE)
  {
    super(allControllers, allAttributes);
    if (!setTime(aTime))
    {
      throw new RuntimeException("Unable to create Event due to aTime. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    performer = new ArrayList<Role>();
    legalPositionSE = new ArrayList<LegalPosition>();
    boolean didAddLegalPositionSE = setLegalPositionSE(allLegalPositionSE);
    if (!didAddLegalPositionSE)
    {
      throw new RuntimeException("Unable to create Event, must have at least 1 legalPositionSE. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetOne */
  public TimePoint getTime()
  {
    return time;
  }
  /* Code from template association_GetMany */
  public Role getPerformer(int index)
  {
    Role aPerformer = performer.get(index);
    return aPerformer;
  }

  public List<Role> getPerformer()
  {
    List<Role> newPerformer = Collections.unmodifiableList(performer);
    return newPerformer;
  }

  public int numberOfPerformer()
  {
    int number = performer.size();
    return number;
  }

  public boolean hasPerformer()
  {
    boolean has = performer.size() > 0;
    return has;
  }

  public int indexOfPerformer(Role aPerformer)
  {
    int index = performer.indexOf(aPerformer);
    return index;
  }
  /* Code from template association_GetMany */
  public LegalPosition getLegalPositionSE(int index)
  {
    LegalPosition aLegalPositionSE = legalPositionSE.get(index);
    return aLegalPositionSE;
  }

  public List<LegalPosition> getLegalPositionSE()
  {
    List<LegalPosition> newLegalPositionSE = Collections.unmodifiableList(legalPositionSE);
    return newLegalPositionSE;
  }

  public int numberOfLegalPositionSE()
  {
    int number = legalPositionSE.size();
    return number;
  }

  public boolean hasLegalPositionSE()
  {
    boolean has = legalPositionSE.size() > 0;
    return has;
  }

  public int indexOfLegalPositionSE(LegalPosition aLegalPositionSE)
  {
    int index = legalPositionSE.indexOf(aLegalPositionSE);
    return index;
  }
  /* Code from template association_GetOne */
  public Situation getPostState()
  {
    return postState;
  }

  public boolean hasPostState()
  {
    boolean has = postState != null;
    return has;
  }
  /* Code from template association_GetOne */
  public Situation getPreState()
  {
    return preState;
  }

  public boolean hasPreState()
  {
    boolean has = preState != null;
    return has;
  }
  /* Code from template association_SetUnidirectionalOne */
  public boolean setTime(TimePoint aNewTime)
  {
    boolean wasSet = false;
    if (aNewTime != null)
    {
      time = aNewTime;
      wasSet = true;
    }
    return wasSet;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfPerformer()
  {
    return 0;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addPerformer(Role aPerformer)
  {
    boolean wasAdded = false;
    if (performer.contains(aPerformer)) { return false; }
    performer.add(aPerformer);
    if (aPerformer.indexOfPerformedEvent(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aPerformer.addPerformedEvent(this);
      if (!wasAdded)
      {
        performer.remove(aPerformer);
      }
    }
    return wasAdded;
  }
  /* Code from template association_RemoveMany */
  public boolean removePerformer(Role aPerformer)
  {
    boolean wasRemoved = false;
    if (!performer.contains(aPerformer))
    {
      return wasRemoved;
    }

    int oldIndex = performer.indexOf(aPerformer);
    performer.remove(oldIndex);
    if (aPerformer.indexOfPerformedEvent(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aPerformer.removePerformedEvent(this);
      if (!wasRemoved)
      {
        performer.add(oldIndex,aPerformer);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addPerformerAt(Role aPerformer, int index)
  {  
    boolean wasAdded = false;
    if(addPerformer(aPerformer))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfPerformer()) { index = numberOfPerformer() - 1; }
      performer.remove(aPerformer);
      performer.add(index, aPerformer);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMovePerformerAt(Role aPerformer, int index)
  {
    boolean wasAdded = false;
    if(performer.contains(aPerformer))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfPerformer()) { index = numberOfPerformer() - 1; }
      performer.remove(aPerformer);
      performer.add(index, aPerformer);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addPerformerAt(aPerformer, index);
    }
    return wasAdded;
  }
  /* Code from template association_IsNumberOfValidMethod */
  public boolean isNumberOfLegalPositionSEValid()
  {
    boolean isValid = numberOfLegalPositionSE() >= minimumNumberOfLegalPositionSE();
    return isValid;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfLegalPositionSE()
  {
    return 1;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addLegalPositionSE(LegalPosition aLegalPositionSE)
  {
    boolean wasAdded = false;
    if (legalPositionSE.contains(aLegalPositionSE)) { return false; }
    legalPositionSE.add(aLegalPositionSE);
    if (aLegalPositionSE.indexOfLegalPositionStateEven(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aLegalPositionSE.addLegalPositionStateEven(this);
      if (!wasAdded)
      {
        legalPositionSE.remove(aLegalPositionSE);
      }
    }
    return wasAdded;
  }
  /* Code from template association_AddMStarToMany */
  public boolean removeLegalPositionSE(LegalPosition aLegalPositionSE)
  {
    boolean wasRemoved = false;
    if (!legalPositionSE.contains(aLegalPositionSE))
    {
      return wasRemoved;
    }

    if (numberOfLegalPositionSE() <= minimumNumberOfLegalPositionSE())
    {
      return wasRemoved;
    }

    int oldIndex = legalPositionSE.indexOf(aLegalPositionSE);
    legalPositionSE.remove(oldIndex);
    if (aLegalPositionSE.indexOfLegalPositionStateEven(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aLegalPositionSE.removeLegalPositionStateEven(this);
      if (!wasRemoved)
      {
        legalPositionSE.add(oldIndex,aLegalPositionSE);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_SetMStarToMany */
  public boolean setLegalPositionSE(LegalPosition... newLegalPositionSE)
  {
    boolean wasSet = false;
    ArrayList<LegalPosition> verifiedLegalPositionSE = new ArrayList<LegalPosition>();
    for (LegalPosition aLegalPositionSE : newLegalPositionSE)
    {
      if (verifiedLegalPositionSE.contains(aLegalPositionSE))
      {
        continue;
      }
      verifiedLegalPositionSE.add(aLegalPositionSE);
    }

    if (verifiedLegalPositionSE.size() != newLegalPositionSE.length || verifiedLegalPositionSE.size() < minimumNumberOfLegalPositionSE())
    {
      return wasSet;
    }

    ArrayList<LegalPosition> oldLegalPositionSE = new ArrayList<LegalPosition>(legalPositionSE);
    legalPositionSE.clear();
    for (LegalPosition aNewLegalPositionSE : verifiedLegalPositionSE)
    {
      legalPositionSE.add(aNewLegalPositionSE);
      if (oldLegalPositionSE.contains(aNewLegalPositionSE))
      {
        oldLegalPositionSE.remove(aNewLegalPositionSE);
      }
      else
      {
        aNewLegalPositionSE.addLegalPositionStateEven(this);
      }
    }

    for (LegalPosition anOldLegalPositionSE : oldLegalPositionSE)
    {
      anOldLegalPositionSE.removeLegalPositionStateEven(this);
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addLegalPositionSEAt(LegalPosition aLegalPositionSE, int index)
  {  
    boolean wasAdded = false;
    if(addLegalPositionSE(aLegalPositionSE))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfLegalPositionSE()) { index = numberOfLegalPositionSE() - 1; }
      legalPositionSE.remove(aLegalPositionSE);
      legalPositionSE.add(index, aLegalPositionSE);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveLegalPositionSEAt(LegalPosition aLegalPositionSE, int index)
  {
    boolean wasAdded = false;
    if(legalPositionSE.contains(aLegalPositionSE))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfLegalPositionSE()) { index = numberOfLegalPositionSE() - 1; }
      legalPositionSE.remove(aLegalPositionSE);
      legalPositionSE.add(index, aLegalPositionSE);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addLegalPositionSEAt(aLegalPositionSE, index);
    }
    return wasAdded;
  }
  /* Code from template association_SetOptionalOneToMany */
  public boolean setPostState(Situation aPostState)
  {
    boolean wasSet = false;
    Situation existingPostState = postState;
    postState = aPostState;
    if (existingPostState != null && !existingPostState.equals(aPostState))
    {
      existingPostState.removePreEvent(this);
    }
    if (aPostState != null)
    {
      aPostState.addPreEvent(this);
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_SetOptionalOneToMany */
  public boolean setPreState(Situation aPreState)
  {
    boolean wasSet = false;
    Situation existingPreState = preState;
    preState = aPreState;
    if (existingPreState != null && !existingPreState.equals(aPreState))
    {
      existingPreState.removePostEvent(this);
    }
    if (aPreState != null)
    {
      aPreState.addPostEvent(this);
    }
    wasSet = true;
    return wasSet;
  }

  public void delete()
  {
    time = null;
    ArrayList<Role> copyOfPerformer = new ArrayList<Role>(performer);
    performer.clear();
    for(Role aPerformer : copyOfPerformer)
    {
      aPerformer.removePerformedEvent(this);
    }
    ArrayList<LegalPosition> copyOfLegalPositionSE = new ArrayList<LegalPosition>(legalPositionSE);
    legalPositionSE.clear();
    for(LegalPosition aLegalPositionSE : copyOfLegalPositionSE)
    {
      aLegalPositionSE.removeLegalPositionStateEven(this);
    }
    if (postState != null)
    {
      Situation placeholderPostState = postState;
      this.postState = null;
      placeholderPostState.removePreEvent(this);
    }
    if (preState != null)
    {
      Situation placeholderPreState = preState;
      this.preState = null;
      placeholderPreState.removePostEvent(this);
    }
    super.delete();
  }

}