/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

/**
 * For Access Control
 */
// line 245 "model.ump"
// line 363 "model.ump"
public class AbstractEvent extends Resource
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //AbstractEvent Associations
  private List<Attribute> attributes;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public AbstractEvent(Role[] allControllers, Attribute[] allAttributes)
  {
    super(allControllers);
    attributes = new ArrayList<Attribute>();
    boolean didAddAttributes = setAttributes(allAttributes);
    if (!didAddAttributes)
    {
      throw new RuntimeException("Unable to create AbstractEvent, must have at least 1 attributes. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------
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
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfAttributes()
  {
    return 1;
  }
  /* Code from template association_AddMNToOptionalOne */
  public boolean addAttribute(Attribute aAttribute)
  {
    boolean wasAdded = false;
    if (attributes.contains(aAttribute)) { return false; }
    AbstractEvent existingAbstractEvent = aAttribute.getAbstractEvent();
    if (existingAbstractEvent != null && existingAbstractEvent.numberOfAttributes() <= minimumNumberOfAttributes())
    {
      return wasAdded;
    }
    else if (existingAbstractEvent != null)
    {
      existingAbstractEvent.attributes.remove(aAttribute);
    }
    attributes.add(aAttribute);
    setAbstractEvent(aAttribute,this);
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeAttribute(Attribute aAttribute)
  {
    boolean wasRemoved = false;
    if (attributes.contains(aAttribute) && numberOfAttributes() > minimumNumberOfAttributes())
    {
      attributes.remove(aAttribute);
      setAbstractEvent(aAttribute,null);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_SetMNToOptionalOne */
  public boolean setAttributes(Attribute... newAttributes)
  {
    boolean wasSet = false;
    if (newAttributes.length < minimumNumberOfAttributes())
    {
      return wasSet;
    }

    ArrayList<Attribute> checkNewAttributes = new ArrayList<Attribute>();
    HashMap<AbstractEvent,Integer> abstractEventToNewAttributes = new HashMap<AbstractEvent,Integer>();
    for (Attribute aAttribute : newAttributes)
    {
      if (checkNewAttributes.contains(aAttribute))
      {
        return wasSet;
      }
      else if (aAttribute.getAbstractEvent() != null && !this.equals(aAttribute.getAbstractEvent()))
      {
        AbstractEvent existingAbstractEvent = aAttribute.getAbstractEvent();
        if (!abstractEventToNewAttributes.containsKey(existingAbstractEvent))
        {
          abstractEventToNewAttributes.put(existingAbstractEvent, Integer.valueOf(existingAbstractEvent.numberOfAttributes()));
        }
        Integer currentCount = abstractEventToNewAttributes.get(existingAbstractEvent);
        int nextCount = currentCount - 1;
        if (nextCount < 1)
        {
          return wasSet;
        }
        abstractEventToNewAttributes.put(existingAbstractEvent, Integer.valueOf(nextCount));
      }
      checkNewAttributes.add(aAttribute);
    }

    attributes.removeAll(checkNewAttributes);

    for (Attribute orphan : attributes)
    {
      setAbstractEvent(orphan, null);
    }
    attributes.clear();
    for (Attribute aAttribute : newAttributes)
    {
      if (aAttribute.getAbstractEvent() != null)
      {
        aAttribute.getAbstractEvent().attributes.remove(aAttribute);
      }
      setAbstractEvent(aAttribute, this);
      attributes.add(aAttribute);
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_GetPrivate */
  private void setAbstractEvent(Attribute aAttribute, AbstractEvent aAbstractEvent)
  {
    try
    {
      java.lang.reflect.Field mentorField = aAttribute.getClass().getDeclaredField("abstractEvent");
      mentorField.setAccessible(true);
      mentorField.set(aAttribute, aAbstractEvent);
    }
    catch (Exception e)
    {
      throw new RuntimeException("Issue internally setting aAbstractEvent to aAttribute", e);
    }
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

  public void delete()
  {
    for(Attribute aAttribute : attributes)
    {
      setAbstractEvent(aAttribute,null);
    }
    attributes.clear();
    super.delete();
  }

}