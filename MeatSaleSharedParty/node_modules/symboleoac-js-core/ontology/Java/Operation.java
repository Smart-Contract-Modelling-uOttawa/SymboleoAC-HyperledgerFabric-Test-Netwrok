/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

/**
 * For Access Control
 */
// line 211 "model.ump"
// line 337 "model.ump"
public class Operation extends Resource
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Operation Attributes
  private Condition preCondition;
  private Condition postCondition;

  //Operation Associations
  private List<Role> performer;
  private List<Attribute> inputAttributs;
  private List<Attribute> outputAttributs;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Operation(Condition aPreCondition, Condition aPostCondition, Role... allControllers)
  {
    super(allControllers);
    preCondition = aPreCondition;
    postCondition = aPostCondition;
    performer = new ArrayList<Role>();
    inputAttributs = new ArrayList<Attribute>();
    outputAttributs = new ArrayList<Attribute>();
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setPreCondition(Condition aPreCondition)
  {
    boolean wasSet = false;
    preCondition = aPreCondition;
    wasSet = true;
    return wasSet;
  }

  public boolean setPostCondition(Condition aPostCondition)
  {
    boolean wasSet = false;
    postCondition = aPostCondition;
    wasSet = true;
    return wasSet;
  }

  public Condition getPreCondition()
  {
    return preCondition;
  }

  public Condition getPostCondition()
  {
    return postCondition;
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
  public Attribute getInputAttribut(int index)
  {
    Attribute aInputAttribut = inputAttributs.get(index);
    return aInputAttribut;
  }

  public List<Attribute> getInputAttributs()
  {
    List<Attribute> newInputAttributs = Collections.unmodifiableList(inputAttributs);
    return newInputAttributs;
  }

  public int numberOfInputAttributs()
  {
    int number = inputAttributs.size();
    return number;
  }

  public boolean hasInputAttributs()
  {
    boolean has = inputAttributs.size() > 0;
    return has;
  }

  public int indexOfInputAttribut(Attribute aInputAttribut)
  {
    int index = inputAttributs.indexOf(aInputAttribut);
    return index;
  }
  /* Code from template association_GetMany */
  public Attribute getOutputAttribut(int index)
  {
    Attribute aOutputAttribut = outputAttributs.get(index);
    return aOutputAttribut;
  }

  public List<Attribute> getOutputAttributs()
  {
    List<Attribute> newOutputAttributs = Collections.unmodifiableList(outputAttributs);
    return newOutputAttributs;
  }

  public int numberOfOutputAttributs()
  {
    int number = outputAttributs.size();
    return number;
  }

  public boolean hasOutputAttributs()
  {
    boolean has = outputAttributs.size() > 0;
    return has;
  }

  public int indexOfOutputAttribut(Attribute aOutputAttribut)
  {
    int index = outputAttributs.indexOf(aOutputAttribut);
    return index;
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
    if (aPerformer.indexOfPerformedOperation(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aPerformer.addPerformedOperation(this);
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
    if (aPerformer.indexOfPerformedOperation(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aPerformer.removePerformedOperation(this);
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
  public boolean isNumberOfInputAttributsValid()
  {
    boolean isValid = numberOfInputAttributs() >= minimumNumberOfInputAttributs();
    return isValid;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfInputAttributs()
  {
    return 1;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addInputAttribut(Attribute aInputAttribut)
  {
    boolean wasAdded = false;
    if (inputAttributs.contains(aInputAttribut)) { return false; }
    inputAttributs.add(aInputAttribut);
    if (aInputAttribut.indexOfConsumerOperation(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aInputAttribut.addConsumerOperation(this);
      if (!wasAdded)
      {
        inputAttributs.remove(aInputAttribut);
      }
    }
    return wasAdded;
  }
  /* Code from template association_AddMStarToMany */
  public boolean removeInputAttribut(Attribute aInputAttribut)
  {
    boolean wasRemoved = false;
    if (!inputAttributs.contains(aInputAttribut))
    {
      return wasRemoved;
    }

    if (numberOfInputAttributs() <= minimumNumberOfInputAttributs())
    {
      return wasRemoved;
    }

    int oldIndex = inputAttributs.indexOf(aInputAttribut);
    inputAttributs.remove(oldIndex);
    if (aInputAttribut.indexOfConsumerOperation(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aInputAttribut.removeConsumerOperation(this);
      if (!wasRemoved)
      {
        inputAttributs.add(oldIndex,aInputAttribut);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_SetMStarToMany */
  public boolean setInputAttributs(Attribute... newInputAttributs)
  {
    boolean wasSet = false;
    ArrayList<Attribute> verifiedInputAttributs = new ArrayList<Attribute>();
    for (Attribute aInputAttribut : newInputAttributs)
    {
      if (verifiedInputAttributs.contains(aInputAttribut))
      {
        continue;
      }
      verifiedInputAttributs.add(aInputAttribut);
    }

    if (verifiedInputAttributs.size() != newInputAttributs.length || verifiedInputAttributs.size() < minimumNumberOfInputAttributs())
    {
      return wasSet;
    }

    ArrayList<Attribute> oldInputAttributs = new ArrayList<Attribute>(inputAttributs);
    inputAttributs.clear();
    for (Attribute aNewInputAttribut : verifiedInputAttributs)
    {
      inputAttributs.add(aNewInputAttribut);
      if (oldInputAttributs.contains(aNewInputAttribut))
      {
        oldInputAttributs.remove(aNewInputAttribut);
      }
      else
      {
        aNewInputAttribut.addConsumerOperation(this);
      }
    }

    for (Attribute anOldInputAttribut : oldInputAttributs)
    {
      anOldInputAttribut.removeConsumerOperation(this);
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addInputAttributAt(Attribute aInputAttribut, int index)
  {  
    boolean wasAdded = false;
    if(addInputAttribut(aInputAttribut))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfInputAttributs()) { index = numberOfInputAttributs() - 1; }
      inputAttributs.remove(aInputAttribut);
      inputAttributs.add(index, aInputAttribut);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveInputAttributAt(Attribute aInputAttribut, int index)
  {
    boolean wasAdded = false;
    if(inputAttributs.contains(aInputAttribut))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfInputAttributs()) { index = numberOfInputAttributs() - 1; }
      inputAttributs.remove(aInputAttribut);
      inputAttributs.add(index, aInputAttribut);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addInputAttributAt(aInputAttribut, index);
    }
    return wasAdded;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfOutputAttributs()
  {
    return 0;
  }
  /* Code from template association_AddManyToOne */
  public Attribute addOutputAttribut(LegalSituation aLegalSituationA, Role... allControllers)
  {
    return new Attribute(this, aLegalSituationA, allControllers);
  }

  public boolean addOutputAttribut(Attribute aOutputAttribut)
  {
    boolean wasAdded = false;
    if (outputAttributs.contains(aOutputAttribut)) { return false; }
    Operation existingProducerOperation = aOutputAttribut.getProducerOperation();
    boolean isNewProducerOperation = existingProducerOperation != null && !this.equals(existingProducerOperation);
    if (isNewProducerOperation)
    {
      aOutputAttribut.setProducerOperation(this);
    }
    else
    {
      outputAttributs.add(aOutputAttribut);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeOutputAttribut(Attribute aOutputAttribut)
  {
    boolean wasRemoved = false;
    //Unable to remove aOutputAttribut, as it must always have a producerOperation
    if (!this.equals(aOutputAttribut.getProducerOperation()))
    {
      outputAttributs.remove(aOutputAttribut);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addOutputAttributAt(Attribute aOutputAttribut, int index)
  {  
    boolean wasAdded = false;
    if(addOutputAttribut(aOutputAttribut))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfOutputAttributs()) { index = numberOfOutputAttributs() - 1; }
      outputAttributs.remove(aOutputAttribut);
      outputAttributs.add(index, aOutputAttribut);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveOutputAttributAt(Attribute aOutputAttribut, int index)
  {
    boolean wasAdded = false;
    if(outputAttributs.contains(aOutputAttribut))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfOutputAttributs()) { index = numberOfOutputAttributs() - 1; }
      outputAttributs.remove(aOutputAttribut);
      outputAttributs.add(index, aOutputAttribut);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addOutputAttributAt(aOutputAttribut, index);
    }
    return wasAdded;
  }

  public void delete()
  {
    ArrayList<Role> copyOfPerformer = new ArrayList<Role>(performer);
    performer.clear();
    for(Role aPerformer : copyOfPerformer)
    {
      aPerformer.removePerformedOperation(this);
    }
    ArrayList<Attribute> copyOfInputAttributs = new ArrayList<Attribute>(inputAttributs);
    inputAttributs.clear();
    for(Attribute aInputAttribut : copyOfInputAttributs)
    {
      if (aInputAttribut.numberOfConsumerOperations() <= Attribute.minimumNumberOfConsumerOperations())
      {
        aInputAttribut.delete();
      }
      else
      {
        aInputAttribut.removeConsumerOperation(this);
      }
    }
    for(int i=outputAttributs.size(); i > 0; i--)
    {
      Attribute aOutputAttribut = outputAttributs.get(i - 1);
      aOutputAttribut.delete();
    }
    super.delete();
  }


  public String toString()
  {
    return super.toString() + "["+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "preCondition" + "=" + (getPreCondition() != null ? !getPreCondition().equals(this)  ? getPreCondition().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "postCondition" + "=" + (getPostCondition() != null ? !getPostCondition().equals(this)  ? getPostCondition().toString().replaceAll("  ","    ") : "this" : "null");
  }
}