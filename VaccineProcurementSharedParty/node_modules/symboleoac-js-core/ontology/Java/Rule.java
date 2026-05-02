/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/



/**
 * For Access Control
 */
// line 197 "model.ump"
// line 331 "model.ump"
public class Rule
{

  //------------------------
  // ENUMERATIONS
  //------------------------

  public enum Action { Read, Write, All, Transfer }
  public enum Decision { Grant, Revoke }

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Rule Attributes
  private Action action;
  private Decision decision;

  //Rule Associations
  private Resource accessedResource;
  private Role accessedRole;
  private Policy policy;
  private Policy constrainedBy;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Rule(Action aAction, Decision aDecision, Resource aAccessedResource, Role aAccessedRole, Policy aPolicy, Policy aConstrainedBy)
  {
    action = aAction;
    decision = aDecision;
    boolean didAddAccessedResource = setAccessedResource(aAccessedResource);
    if (!didAddAccessedResource)
    {
      throw new RuntimeException("Unable to create rule due to accessedResource. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    boolean didAddAccessedRole = setAccessedRole(aAccessedRole);
    if (!didAddAccessedRole)
    {
      throw new RuntimeException("Unable to create ruleAccesseor due to accessedRole. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    boolean didAddPolicy = setPolicy(aPolicy);
    if (!didAddPolicy)
    {
      throw new RuntimeException("Unable to create rule due to policy. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    boolean didAddConstrainedBy = setConstrainedBy(aConstrainedBy);
    if (!didAddConstrainedBy)
    {
      throw new RuntimeException("Unable to create constraint due to constrainedBy. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
  }

  //------------------------
  // INTERFACE
  //------------------------

  public boolean setAction(Action aAction)
  {
    boolean wasSet = false;
    action = aAction;
    wasSet = true;
    return wasSet;
  }

  public boolean setDecision(Decision aDecision)
  {
    boolean wasSet = false;
    decision = aDecision;
    wasSet = true;
    return wasSet;
  }

  public Action getAction()
  {
    return action;
  }

  public Decision getDecision()
  {
    return decision;
  }
  /* Code from template association_GetOne */
  public Resource getAccessedResource()
  {
    return accessedResource;
  }
  /* Code from template association_GetOne */
  public Role getAccessedRole()
  {
    return accessedRole;
  }
  /* Code from template association_GetOne */
  public Policy getPolicy()
  {
    return policy;
  }
  /* Code from template association_GetOne */
  public Policy getConstrainedBy()
  {
    return constrainedBy;
  }
  /* Code from template association_SetOneToOptionalOne */
  public boolean setAccessedResource(Resource aNewAccessedResource)
  {
    boolean wasSet = false;
    if (aNewAccessedResource == null)
    {
      //Unable to setAccessedResource to null, as rule must always be associated to a accessedResource
      return wasSet;
    }
    
    Rule existingRule = aNewAccessedResource.getRule();
    if (existingRule != null && !equals(existingRule))
    {
      //Unable to setAccessedResource, the current accessedResource already has a rule, which would be orphaned if it were re-assigned
      return wasSet;
    }
    
    Resource anOldAccessedResource = accessedResource;
    accessedResource = aNewAccessedResource;
    accessedResource.setRule(this);

    if (anOldAccessedResource != null)
    {
      anOldAccessedResource.setRule(null);
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_SetOneToOptionalOne */
  public boolean setAccessedRole(Role aNewAccessedRole)
  {
    boolean wasSet = false;
    if (aNewAccessedRole == null)
    {
      //Unable to setAccessedRole to null, as ruleAccesseor must always be associated to a accessedRole
      return wasSet;
    }
    
    Rule existingRuleAccesseor = aNewAccessedRole.getRuleAccesseor();
    if (existingRuleAccesseor != null && !equals(existingRuleAccesseor))
    {
      //Unable to setAccessedRole, the current accessedRole already has a ruleAccesseor, which would be orphaned if it were re-assigned
      return wasSet;
    }
    
    Role anOldAccessedRole = accessedRole;
    accessedRole = aNewAccessedRole;
    accessedRole.setRuleAccesseor(this);

    if (anOldAccessedRole != null)
    {
      anOldAccessedRole.setRuleAccesseor(null);
    }
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_SetOneToMany */
  public boolean setPolicy(Policy aPolicy)
  {
    boolean wasSet = false;
    if (aPolicy == null)
    {
      return wasSet;
    }

    Policy existingPolicy = policy;
    policy = aPolicy;
    if (existingPolicy != null && !existingPolicy.equals(aPolicy))
    {
      existingPolicy.removeRule(this);
    }
    policy.addRule(this);
    wasSet = true;
    return wasSet;
  }
  /* Code from template association_SetOneToMany */
  public boolean setConstrainedBy(Policy aConstrainedBy)
  {
    boolean wasSet = false;
    if (aConstrainedBy == null)
    {
      return wasSet;
    }

    Policy existingConstrainedBy = constrainedBy;
    constrainedBy = aConstrainedBy;
    if (existingConstrainedBy != null && !existingConstrainedBy.equals(aConstrainedBy))
    {
      existingConstrainedBy.removeConstraint(this);
    }
    constrainedBy.addConstraint(this);
    wasSet = true;
    return wasSet;
  }

  public void delete()
  {
    Resource existingAccessedResource = accessedResource;
    accessedResource = null;
    if (existingAccessedResource != null)
    {
      existingAccessedResource.setRule(null);
    }
    Role existingAccessedRole = accessedRole;
    accessedRole = null;
    if (existingAccessedRole != null)
    {
      existingAccessedRole.setRuleAccesseor(null);
    }
    Policy placeholderPolicy = policy;
    this.policy = null;
    if(placeholderPolicy != null)
    {
      placeholderPolicy.removeRule(this);
    }
    Policy placeholderConstrainedBy = constrainedBy;
    this.constrainedBy = null;
    if(placeholderConstrainedBy != null)
    {
      placeholderConstrainedBy.removeConstraint(this);
    }
  }


  public String toString()
  {
    return super.toString() + "["+ "]" + System.getProperties().getProperty("line.separator") +
            "  " + "action" + "=" + (getAction() != null ? !getAction().equals(this)  ? getAction().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "decision" + "=" + (getDecision() != null ? !getDecision().equals(this)  ? getDecision().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
            "  " + "accessedResource = "+(getAccessedResource()!=null?Integer.toHexString(System.identityHashCode(getAccessedResource())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "accessedRole = "+(getAccessedRole()!=null?Integer.toHexString(System.identityHashCode(getAccessedRole())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "policy = "+(getPolicy()!=null?Integer.toHexString(System.identityHashCode(getPolicy())):"null") + System.getProperties().getProperty("line.separator") +
            "  " + "constrainedBy = "+(getConstrainedBy()!=null?Integer.toHexString(System.identityHashCode(getConstrainedBy())):"null");
  }
}