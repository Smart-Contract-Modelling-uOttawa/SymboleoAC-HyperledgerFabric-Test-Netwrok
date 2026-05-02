/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

/**
 * For Access Control
 */
// line 181 "model.ump"
// line 324 "model.ump"
public class Resource
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Resource Associations
  private List<Role> controllers;
  private Rule rule;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Resource(Role... allControllers)
  {
    controllers = new ArrayList<Role>();
    boolean didAddControllers = setControllers(allControllers);
    if (!didAddControllers)
    {
      throw new RuntimeException("Unable to create Resource, must have at least 1 controllers. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetMany */
  public Role getController(int index)
  {
    Role aController = controllers.get(index);
    return aController;
  }

  public List<Role> getControllers()
  {
    List<Role> newControllers = Collections.unmodifiableList(controllers);
    return newControllers;
  }

  public int numberOfControllers()
  {
    int number = controllers.size();
    return number;
  }

  public boolean hasControllers()
  {
    boolean has = controllers.size() > 0;
    return has;
  }

  public int indexOfController(Role aController)
  {
    int index = controllers.indexOf(aController);
    return index;
  }
  /* Code from template association_GetOne */
  public Rule getRule()
  {
    return rule;
  }

  public boolean hasRule()
  {
    boolean has = rule != null;
    return has;
  }
  /* Code from template association_IsNumberOfValidMethod */
  public boolean isNumberOfControllersValid()
  {
    boolean isValid = numberOfControllers() >= minimumNumberOfControllers();
    return isValid;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfControllers()
  {
    return 1;
  }
  /* Code from template association_AddManyToManyMethod */
  public boolean addController(Role aController)
  {
    boolean wasAdded = false;
    if (controllers.contains(aController)) { return false; }
    controllers.add(aController);
    if (aController.indexOfControlledResource(this) != -1)
    {
      wasAdded = true;
    }
    else
    {
      wasAdded = aController.addControlledResource(this);
      if (!wasAdded)
      {
        controllers.remove(aController);
      }
    }
    return wasAdded;
  }
  /* Code from template association_AddMStarToMany */
  public boolean removeController(Role aController)
  {
    boolean wasRemoved = false;
    if (!controllers.contains(aController))
    {
      return wasRemoved;
    }

    if (numberOfControllers() <= minimumNumberOfControllers())
    {
      return wasRemoved;
    }

    int oldIndex = controllers.indexOf(aController);
    controllers.remove(oldIndex);
    if (aController.indexOfControlledResource(this) == -1)
    {
      wasRemoved = true;
    }
    else
    {
      wasRemoved = aController.removeControlledResource(this);
      if (!wasRemoved)
      {
        controllers.add(oldIndex,aController);
      }
    }
    return wasRemoved;
  }
  /* Code from template association_SetMStarToMany */
  public boolean setControllers(Role... newControllers)
  {
    boolean wasSet = false;
    ArrayList<Role> verifiedControllers = new ArrayList<Role>();
    for (Role aController : newControllers)
    {
      if (verifiedControllers.contains(aController))
      {
        continue;
      }
      verifiedControllers.add(aController);
    }

    if (verifiedControllers.size() != newControllers.length || verifiedControllers.size() < minimumNumberOfControllers())
    {
      return wasSet;
    }

    ArrayList<Role> oldControllers = new ArrayList<Role>(controllers);
    controllers.clear();
    for (Role aNewController : verifiedControllers)
    {
      controllers.add(aNewController);
      if (oldControllers.contains(aNewController))
      {
        oldControllers.remove(aNewController);
      }
      else
      {
        aNewController.addControlledResource(this);
      }
    }

    for (Role anOldController : oldControllers)
    {
      anOldController.removeControlledResource(this);
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addControllerAt(Role aController, int index)
  {  
    boolean wasAdded = false;
    if(addController(aController))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfControllers()) { index = numberOfControllers() - 1; }
      controllers.remove(aController);
      controllers.add(index, aController);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveControllerAt(Role aController, int index)
  {
    boolean wasAdded = false;
    if(controllers.contains(aController))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfControllers()) { index = numberOfControllers() - 1; }
      controllers.remove(aController);
      controllers.add(index, aController);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addControllerAt(aController, index);
    }
    return wasAdded;
  }
  /* Code from template association_SetOptionalOneToOne */
  public boolean setRule(Rule aNewRule)
  {
    boolean wasSet = false;
    if (rule != null && !rule.equals(aNewRule) && equals(rule.getAccessedResource()))
    {
      //Unable to setRule, as existing rule would become an orphan
      return wasSet;
    }

    rule = aNewRule;
    Resource anOldAccessedResource = aNewRule != null ? aNewRule.getAccessedResource() : null;

    if (!this.equals(anOldAccessedResource))
    {
      if (anOldAccessedResource != null)
      {
        anOldAccessedResource.rule = null;
      }
      if (rule != null)
      {
        rule.setAccessedResource(this);
      }
    }
    wasSet = true;
    return wasSet;
  }

  public void delete()
  {
    ArrayList<Role> copyOfControllers = new ArrayList<Role>(controllers);
    controllers.clear();
    for(Role aController : copyOfControllers)
    {
      aController.removeControlledResource(this);
    }
    Rule existingRule = rule;
    rule = null;
    if (existingRule != null)
    {
      existingRule.delete();
    }
  }

}