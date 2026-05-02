/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

/**
 * For Access Control
 */
// line 223 "model.ump"
// line 343 "model.ump"
public class Attribute extends Resource
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Attribute Associations
  private List<Operation> consumerOperations;
  private Operation producerOperation;
  private LegalSituation legalSituationA;
  private AbstractEvent abstractEvent;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Attribute(Operation aProducerOperation, LegalSituation aLegalSituationA, Role... allControllers)
  {
    super(allControllers);
    consumerOperations = new ArrayList<Operation>();
    boolean didAddProducerOperation = setProducerOperation(aProducerOperation);
    if (!didAddProducerOperation)
    {
      throw new RuntimeException("Unable to create outputAttribut due to producerOperation. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    boolean didAddLegalSituationA = setLegalSituationA(aLegalSituationA);
    if (!didAddLegalSituationA)
    {
      throw new RuntimeException("Unable to create attribute due to legalSituationA. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetMany */
  public Operation getConsumerOperation(int index)
  {
    Operation aConsumerOperation = consumerOperations.get(index);
    return aConsumerOperation;
  }

  public List<Operation> getConsumerOperations()
  {
    List<Operation> newConsumerOperations = Collections.unmodifiableList(consumerOperations);
    return newConsumerOperations;
  }

  public int numberOfConsumerOperations()
  {
    int number = consumerOperations.size();
    return number;
  }

  public boolean hasConsumerOperations()
  {
    boolean has = consumerOperations.size() > 0;
    return has;
  }

  public int indexOfConsumerOperation(Operation aConsumerOperation)
  {
    int index = consumerOperations.indexOf(aConsumerOperation);
    return index;
  }
  /* Code from template association_GetOne */
  public Operation getProducerOperation()
  {
    return producerOperation;
  }
  /* Code from template association_GetOne */
  public LegalSituation getLegalSituationA()
  {
    return legalSituationA;
  }
  /* Code from template association_GetOne */
  public AbstractEvent getAbstractEvent()
  {
    return abstractEvent;
  }

  public boolean hasAbstractEvent()
  {
    boolean has = abstractEvent != null;
    return has;
  }
  /* Code from template association_IsNumberOfValidMethod */
  public boolean isNumberOfConsumerOperationsValid()
  {
    boolean isValid = numberOfConsumerOperations() >= minimumNumberOfConsumerOperations();
    return isValid;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfConsumerOperations()
  {
    return 1;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addConsumerOperation(Operation aConsumerOperation)
  {
    boolean wasAdded = false;
    if (consumerOperations.contains(aConsumerOperation)) { return false; }
    consumerOperations.add(aConsumerOperation);
    if (aConsumerOperation.indexOfInputAttribut(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aConsumerOperation.addInputAttribut(this);
      if (!wasAdded)
      {
        consumerOperations.remove(aConsumerOperation);
      }
    }
    return wasAdded;
  }
  /* Code from template association_AddMStarToMany */
  public boolean removeConsumerOperation(Operation aConsumerOperation)
  {
    boolean wasRemoved = false;
    if (!consumerOperations.contains(aConsumerOperation))
    {
      return wasRemoved;
    }

    if (numberOfConsumerOperations() <= minimumNumberOfConsumerOperations())
    {
      return wasRemoved;
    }

    int oldIndex = consumerOperations.indexOf(aConsumerOperation);
    consumerOperations.remove(oldIndex);
    if (aConsumerOperation.indexOfInputAttribut(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aConsumerOperation.removeInputAttribut(this);
      if (!wasRemoved)
      {
        consumerOperations.add(oldIndex,aConsumerOperation);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_SetMStarToMany */
  public boolean setConsumerOperations(Operation... newConsumerOperations)
  {
    boolean wasSet = false;
    ArrayList<Operation> verifiedConsumerOperations = new ArrayList<Operation>();
    for (Operation aConsumerOperation : newConsumerOperations)
    {
      if (verifiedConsumerOperations.contains(aConsumerOperation))
      {
        continue;
      }
      verifiedConsumerOperations.add(aConsumerOperation);
    }

    if (verifiedConsumerOperations.size() != newConsumerOperations.length || verifiedConsumerOperations.size() < minimumNumberOfConsumerOperations())
    {
      return wasSet;
    }

    ArrayList<Operation> oldConsumerOperations = new ArrayList<Operation>(consumerOperations);
    consumerOperations.clear();
    for (Operation aNewConsumerOperation : verifiedConsumerOperations)
    {
      consumerOperations.add(aNewConsumerOperation);
      if (oldConsumerOperations.contains(aNewConsumerOperation))
      {
        oldConsumerOperations.remove(aNewConsumerOperation);
      }
      else
      {
        aNewConsumerOperation.addInputAttribut(this);
      }
    }

    for (Operation anOldConsumerOperation : oldConsumerOperations)
    {
      anOldConsumerOperation.removeInputAttribut(this);
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addConsumerOperationAt(Operation aConsumerOperation, int index)
  {  
    boolean wasAdded = false;
    if(addConsumerOperation(aConsumerOperation))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfConsumerOperations()) { index = numberOfConsumerOperations() - 1; }
      consumerOperations.remove(aConsumerOperation);
      consumerOperations.add(index, aConsumerOperation);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveConsumerOperationAt(Operation aConsumerOperation, int index)
  {
    boolean wasAdded = false;
    if(consumerOperations.contains(aConsumerOperation))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfConsumerOperations()) { index = numberOfConsumerOperations() - 1; }
      consumerOperations.remove(aConsumerOperation);
      consumerOperations.add(index, aConsumerOperation);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addConsumerOperationAt(aConsumerOperation, index);
    }
    return wasAdded;
  }
  /* Code from template association_SetOneToMany */
  public boolean setProducerOperation(Operation aProducerOperation)
  {
    boolean wasSet = false;
    if (aProducerOperation == null)
    {
      return wasSet;
    }

    Operation existingProducerOperation = producerOperation;
    producerOperation = aProducerOperation;
    if (existingProducerOperation != null && !existingProducerOperation.equals(aProducerOperation))
    {
      existingProducerOperation.removeOutputAttribut(this);
    }
    producerOperation.addOutputAttribut(this);
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_SetOneToMany */
  public boolean setLegalSituationA(LegalSituation aLegalSituationA)
  {
    boolean wasSet = false;
    if (aLegalSituationA == null)
    {
      return wasSet;
    }

    LegalSituation existingLegalSituationA = legalSituationA;
    legalSituationA = aLegalSituationA;
    if (existingLegalSituationA != null && !existingLegalSituationA.equals(aLegalSituationA))
    {
      existingLegalSituationA.removeAttribute(this);
    }
    legalSituationA.addAttribute(this);
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_SetOptionalOneToMandatoryMany */
  public boolean setAbstractEvent(AbstractEvent aAbstractEvent)
  {
    //
    // This source of this source generation is association_SetOptionalOneToMandatoryMany.jet
    // This set file assumes the generation of a maximumNumberOfXXX method does not exist because 
    // it's not required (No upper bound)
    //   
    boolean wasSet = false;
    AbstractEvent existingAbstractEvent = abstractEvent;

    if (existingAbstractEvent == null)
    {
      if (aAbstractEvent != null)
      {
        if (aAbstractEvent.addAttribute(this))
        {
          existingAbstractEvent = aAbstractEvent;
          wasSet = true;
        }
      }
    } 
    else if (existingAbstractEvent != null)
    {
      if (aAbstractEvent == null)
      {
        if (existingAbstractEvent.minimumNumberOfAttributes() < existingAbstractEvent.numberOfAttributes())
        {
          existingAbstractEvent.removeAttribute(this);
          existingAbstractEvent = aAbstractEvent;  // aAbstractEvent == null
          wasSet = true;
        }
      } 
      else
      {
        if (existingAbstractEvent.minimumNumberOfAttributes() < existingAbstractEvent.numberOfAttributes())
        {
          existingAbstractEvent.removeAttribute(this);
          aAbstractEvent.addAttribute(this);
          existingAbstractEvent = aAbstractEvent;
          wasSet = true;
        }
      }
    }
    if (wasSet)
    {
      abstractEvent = existingAbstractEvent;
    }
    return wasSet;
  }
  
  public void delete()
  {
    ArrayList<Operation> copyOfConsumerOperations = new ArrayList<Operation>(consumerOperations);
    consumerOperations.clear();
    for(Operation aConsumerOperation : copyOfConsumerOperations)
    {
      if (aConsumerOperation.numberOfInputAttributs() <= Operation.minimumNumberOfInputAttributs())
      {
        aConsumerOperation.delete();
      }
      else
      {
        aConsumerOperation.removeInputAttribut(this);
      }
    }
    Operation placeholderProducerOperation = producerOperation;
    this.producerOperation = null;
    if(placeholderProducerOperation != null)
    {
      placeholderProducerOperation.removeOutputAttribut(this);
    }
    LegalSituation placeholderLegalSituationA = legalSituationA;
    this.legalSituationA = null;
    if(placeholderLegalSituationA != null)
    {
      placeholderLegalSituationA.removeAttribute(this);
    }
    if (abstractEvent != null)
    {
      if (abstractEvent.numberOfAttributes() <= 1)
      {
        abstractEvent.delete();
      }
      else
      {
        AbstractEvent placeholderAbstractEvent = abstractEvent;
        this.abstractEvent = null;
        placeholderAbstractEvent.removeAttribute(this);
      }
    }
    super.delete();
  }

}