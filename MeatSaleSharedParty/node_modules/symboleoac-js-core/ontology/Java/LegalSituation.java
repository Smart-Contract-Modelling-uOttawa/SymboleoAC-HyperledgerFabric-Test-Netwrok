/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

// line 101 "model.ump"
// line 306 "model.ump"
public class LegalSituation extends Situation
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //LegalSituation Associations
  private List<Data> data;
  private List<Attribute> attributes;
  private List<LegalPosition> antecedentOf;
  private List<LegalPosition> consequentOf;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public LegalSituation(TimeInterval aTime)
  {
    super(aTime);
    data = new ArrayList<Data>();
    attributes = new ArrayList<Attribute>();
    antecedentOf = new ArrayList<LegalPosition>();
    consequentOf = new ArrayList<LegalPosition>();
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetMany */
  public Data getData(int index)
  {
    Data aData = data.get(index);
    return aData;
  }

  /**
   * For Access Control
   */
  public List<Data> getData()
  {
    List<Data> newData = Collections.unmodifiableList(data);
    return newData;
  }

  public int numberOfData()
  {
    int number = data.size();
    return number;
  }

  public boolean hasData()
  {
    boolean has = data.size() > 0;
    return has;
  }

  public int indexOfData(Data aData)
  {
    int index = data.indexOf(aData);
    return index;
  }
  /* Code from template association_GetMany */
  public Attribute getAttribute(int index)
  {
    Attribute aAttribute = attributes.get(index);
    return aAttribute;
  }

  public List<Attribute> getAttributes()
  {
    List<Attribute> newAttributes = Collections.unmodifiableList(attributes);
    return newAttributes;
  }

  public int numberOfAttributes()
  {
    int number = attributes.size();
    return number;
  }

  public boolean hasAttributes()
  {
    boolean has = attributes.size() > 0;
    return has;
  }

  public int indexOfAttribute(Attribute aAttribute)
  {
    int index = attributes.indexOf(aAttribute);
    return index;
  }
  /* Code from template association_GetMany */
  public LegalPosition getAntecedentOf(int index)
  {
    LegalPosition aAntecedentOf = antecedentOf.get(index);
    return aAntecedentOf;
  }

  public List<LegalPosition> getAntecedentOf()
  {
    List<LegalPosition> newAntecedentOf = Collections.unmodifiableList(antecedentOf);
    return newAntecedentOf;
  }

  public int numberOfAntecedentOf()
  {
    int number = antecedentOf.size();
    return number;
  }

  public boolean hasAntecedentOf()
  {
    boolean has = antecedentOf.size() > 0;
    return has;
  }

  public int indexOfAntecedentOf(LegalPosition aAntecedentOf)
  {
    int index = antecedentOf.indexOf(aAntecedentOf);
    return index;
  }
  /* Code from template association_GetMany */
  public LegalPosition getConsequentOf(int index)
  {
    LegalPosition aConsequentOf = consequentOf.get(index);
    return aConsequentOf;
  }

  public List<LegalPosition> getConsequentOf()
  {
    List<LegalPosition> newConsequentOf = Collections.unmodifiableList(consequentOf);
    return newConsequentOf;
  }

  public int numberOfConsequentOf()
  {
    int number = consequentOf.size();
    return number;
  }

  public boolean hasConsequentOf()
  {
    boolean has = consequentOf.size() > 0;
    return has;
  }

  public int indexOfConsequentOf(LegalPosition aConsequentOf)
  {
    int index = consequentOf.indexOf(aConsequentOf);
    return index;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfData()
  {
    return 0;
  }
  /* Code from template association_AddManyToOptionalOne */
  public boolean addData(Data aData)
  {
    boolean wasAdded = false;
    if (data.contains(aData)) { return false; }
    LegalSituation existingLegalSituationD = aData.getLegalSituationD();
    if (existingLegalSituationD == null)
    {
      aData.setLegalSituationD(this);
    }
    else if (!this.equals(existingLegalSituationD))
    {
      existingLegalSituationD.removeData(aData);
      addData(aData);
    }
    else
    {
      data.add(aData);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeData(Data aData)
  {
    boolean wasRemoved = false;
    if (data.contains(aData))
    {
      data.remove(aData);
      aData.setLegalSituationD(null);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addDataAt(Data aData, int index)
  {  
    boolean wasAdded = false;
    if(addData(aData))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfData()) { index = numberOfData() - 1; }
      data.remove(aData);
      data.add(index, aData);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveDataAt(Data aData, int index)
  {
    boolean wasAdded = false;
    if(data.contains(aData))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfData()) { index = numberOfData() - 1; }
      data.remove(aData);
      data.add(index, aData);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addDataAt(aData, index);
    }
    return wasAdded;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfAttributes()
  {
    return 0;
  }
  /* Code from template association_AddManyToOne */
  public Attribute addAttribute(Operation aProducerOperation, Role... allControllers)
  {
    return new Attribute(aProducerOperation, this, allControllers);
  }

  public boolean addAttribute(Attribute aAttribute)
  {
    boolean wasAdded = false;
    if (attributes.contains(aAttribute)) { return false; }
    LegalSituation existingLegalSituationA = aAttribute.getLegalSituationA();
    boolean isNewLegalSituationA = existingLegalSituationA != null && !this.equals(existingLegalSituationA);
    if (isNewLegalSituationA)
    {
      aAttribute.setLegalSituationA(this);
    }
    else
    {
      attributes.add(aAttribute);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeAttribute(Attribute aAttribute)
  {
    boolean wasRemoved = false;
    //Unable to remove aAttribute, as it must always have a legalSituationA
    if (!this.equals(aAttribute.getLegalSituationA()))
    {
      attributes.remove(aAttribute);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addAttributeAt(Attribute aAttribute, int index)
  {  
    boolean wasAdded = false;
    if(addAttribute(aAttribute))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfAttributes()) { index = numberOfAttributes() - 1; }
      attributes.remove(aAttribute);
      attributes.add(index, aAttribute);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveAttributeAt(Attribute aAttribute, int index)
  {
    boolean wasAdded = false;
    if(attributes.contains(aAttribute))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfAttributes()) { index = numberOfAttributes() - 1; }
      attributes.remove(aAttribute);
      attributes.add(index, aAttribute);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addAttributeAt(aAttribute, index);
    }
    return wasAdded;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfAntecedentOf()
  {
    return 0;
  }
  /* Code from template association_AddManyToOne */
  public LegalPosition addAntecedentOf(LegalSituation aConsequent, StateTransition aStateTransition, Contract aContract, Role aDebtor, Role aCreditor, Role... allControllers)
  {
    return new LegalPosition(this, aConsequent, aStateTransition, aContract, aDebtor, aCreditor, allControllers);
  }

  public boolean addAntecedentOf(LegalPosition aAntecedentOf)
  {
    boolean wasAdded = false;
    if (antecedentOf.contains(aAntecedentOf)) { return false; }
    LegalSituation existingAntecedent = aAntecedentOf.getAntecedent();
    boolean isNewAntecedent = existingAntecedent != null && !this.equals(existingAntecedent);
    if (isNewAntecedent)
    {
      aAntecedentOf.setAntecedent(this);
    }
    else
    {
      antecedentOf.add(aAntecedentOf);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeAntecedentOf(LegalPosition aAntecedentOf)
  {
    boolean wasRemoved = false;
    //Unable to remove aAntecedentOf, as it must always have a antecedent
    if (!this.equals(aAntecedentOf.getAntecedent()))
    {
      antecedentOf.remove(aAntecedentOf);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addAntecedentOfAt(LegalPosition aAntecedentOf, int index)
  {  
    boolean wasAdded = false;
    if(addAntecedentOf(aAntecedentOf))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfAntecedentOf()) { index = numberOfAntecedentOf() - 1; }
      antecedentOf.remove(aAntecedentOf);
      antecedentOf.add(index, aAntecedentOf);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveAntecedentOfAt(LegalPosition aAntecedentOf, int index)
  {
    boolean wasAdded = false;
    if(antecedentOf.contains(aAntecedentOf))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfAntecedentOf()) { index = numberOfAntecedentOf() - 1; }
      antecedentOf.remove(aAntecedentOf);
      antecedentOf.add(index, aAntecedentOf);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addAntecedentOfAt(aAntecedentOf, index);
    }
    return wasAdded;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfConsequentOf()
  {
    return 0;
  }
  /* Code from template association_AddManyToOne */
  public LegalPosition addConsequentOf(LegalSituation aAntecedent, StateTransition aStateTransition, Contract aContract, Role aDebtor, Role aCreditor, Role... allControllers)
  {
    return new LegalPosition(aAntecedent, this, aStateTransition, aContract, aDebtor, aCreditor, allControllers);
  }

  public boolean addConsequentOf(LegalPosition aConsequentOf)
  {
    boolean wasAdded = false;
    if (consequentOf.contains(aConsequentOf)) { return false; }
    LegalSituation existingConsequent = aConsequentOf.getConsequent();
    boolean isNewConsequent = existingConsequent != null && !this.equals(existingConsequent);
    if (isNewConsequent)
    {
      aConsequentOf.setConsequent(this);
    }
    else
    {
      consequentOf.add(aConsequentOf);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeConsequentOf(LegalPosition aConsequentOf)
  {
    boolean wasRemoved = false;
    //Unable to remove aConsequentOf, as it must always have a consequent
    if (!this.equals(aConsequentOf.getConsequent()))
    {
      consequentOf.remove(aConsequentOf);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addConsequentOfAt(LegalPosition aConsequentOf, int index)
  {  
    boolean wasAdded = false;
    if(addConsequentOf(aConsequentOf))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfConsequentOf()) { index = numberOfConsequentOf() - 1; }
      consequentOf.remove(aConsequentOf);
      consequentOf.add(index, aConsequentOf);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveConsequentOfAt(LegalPosition aConsequentOf, int index)
  {
    boolean wasAdded = false;
    if(consequentOf.contains(aConsequentOf))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfConsequentOf()) { index = numberOfConsequentOf() - 1; }
      consequentOf.remove(aConsequentOf);
      consequentOf.add(index, aConsequentOf);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addConsequentOfAt(aConsequentOf, index);
    }
    return wasAdded;
  }

  public void delete()
  {
    while (data.size() > 0)
    {
      Data aData = data.get(data.size() - 1);
      aData.delete();
      data.remove(aData);
    }
    
    while (attributes.size() > 0)
    {
      Attribute aAttribute = attributes.get(attributes.size() - 1);
      aAttribute.delete();
      attributes.remove(aAttribute);
    }
    
    for(int i=antecedentOf.size(); i > 0; i--)
    {
      LegalPosition aAntecedentOf = antecedentOf.get(i - 1);
      aAntecedentOf.delete();
    }
    for(int i=consequentOf.size(); i > 0; i--)
    {
      LegalPosition aConsequentOf = consequentOf.get(i - 1);
      aConsequentOf.delete();
    }
    super.delete();
  }

}