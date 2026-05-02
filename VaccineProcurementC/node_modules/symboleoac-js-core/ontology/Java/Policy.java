/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

/**
 * For Access Control
 */
// line 187 "model.ump"
// line 348 "model.ump"
public class Policy extends Resource
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Policy Associations
  private List<Rule> rules;
  private List<Rule> constraints;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Policy(Role... allControllers)
  {
    super(allControllers);
    rules = new ArrayList<Rule>();
    constraints = new ArrayList<Rule>();
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetMany */
  public Rule getRule(int index)
  {
    Rule aRule = rules.get(index);
    return aRule;
  }

  public List<Rule> getRules()
  {
    List<Rule> newRules = Collections.unmodifiableList(rules);
    return newRules;
  }

  public int numberOfRules()
  {
    int number = rules.size();
    return number;
  }

  public boolean hasRules()
  {
    boolean has = rules.size() > 0;
    return has;
  }

  public int indexOfRule(Rule aRule)
  {
    int index = rules.indexOf(aRule);
    return index;
  }
  /* Code from template association_GetMany */
  public Rule getConstraint(int index)
  {
    Rule aConstraint = constraints.get(index);
    return aConstraint;
  }

  public List<Rule> getConstraints()
  {
    List<Rule> newConstraints = Collections.unmodifiableList(constraints);
    return newConstraints;
  }

  public int numberOfConstraints()
  {
    int number = constraints.size();
    return number;
  }

  public boolean hasConstraints()
  {
    boolean has = constraints.size() > 0;
    return has;
  }

  public int indexOfConstraint(Rule aConstraint)
  {
    int index = constraints.indexOf(aConstraint);
    return index;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfRules()
  {
    return 0;
  }
  /* Code from template association_AddManyToOne */
  public Rule addRule(Rule.Action aAction, Rule.Decision aDecision, Resource aAccessedResource, Role aAccessedRole, Policy aConstrainedBy)
  {
    return new Rule(aAction, aDecision, aAccessedResource, aAccessedRole, this, aConstrainedBy);
  }

  public boolean addRule(Rule aRule)
  {
    boolean wasAdded = false;
    if (rules.contains(aRule)) { return false; }
    Policy existingPolicy = aRule.getPolicy();
    boolean isNewPolicy = existingPolicy != null && !this.equals(existingPolicy);
    if (isNewPolicy)
    {
      aRule.setPolicy(this);
    }
    else
    {
      rules.add(aRule);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeRule(Rule aRule)
  {
    boolean wasRemoved = false;
    //Unable to remove aRule, as it must always have a policy
    if (!this.equals(aRule.getPolicy()))
    {
      rules.remove(aRule);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addRuleAt(Rule aRule, int index)
  {  
    boolean wasAdded = false;
    if(addRule(aRule))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfRules()) { index = numberOfRules() - 1; }
      rules.remove(aRule);
      rules.add(index, aRule);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveRuleAt(Rule aRule, int index)
  {
    boolean wasAdded = false;
    if(rules.contains(aRule))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfRules()) { index = numberOfRules() - 1; }
      rules.remove(aRule);
      rules.add(index, aRule);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addRuleAt(aRule, index);
    }
    return wasAdded;
  }
  /* Code from template association_MinimumNumberOfMethod */
  public static int minimumNumberOfConstraints()
  {
    return 0;
  }
  /* Code from template association_AddManyToOne */
  public Rule addConstraint(Rule.Action aAction, Rule.Decision aDecision, Resource aAccessedResource, Role aAccessedRole, Policy aPolicy)
  {
    return new Rule(aAction, aDecision, aAccessedResource, aAccessedRole, aPolicy, this);
  }

  public boolean addConstraint(Rule aConstraint)
  {
    boolean wasAdded = false;
    if (constraints.contains(aConstraint)) { return false; }
    Policy existingConstrainedBy = aConstraint.getConstrainedBy();
    boolean isNewConstrainedBy = existingConstrainedBy != null && !this.equals(existingConstrainedBy);
    if (isNewConstrainedBy)
    {
      aConstraint.setConstrainedBy(this);
    }
    else
    {
      constraints.add(aConstraint);
    }
    wasAdded = true;
    return wasAdded;
  }

  public boolean removeConstraint(Rule aConstraint)
  {
    boolean wasRemoved = false;
    //Unable to remove aConstraint, as it must always have a constrainedBy
    if (!this.equals(aConstraint.getConstrainedBy()))
    {
      constraints.remove(aConstraint);
      wasRemoved = true;
    }
    return wasRemoved;
  }
  /* Code from template association_AddIndexControlFunctions */
  public boolean addConstraintAt(Rule aConstraint, int index)
  {  
    boolean wasAdded = false;
    if(addConstraint(aConstraint))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfConstraints()) { index = numberOfConstraints() - 1; }
      constraints.remove(aConstraint);
      constraints.add(index, aConstraint);
      wasAdded = true;
    }
    return wasAdded;
  }

  public boolean addOrMoveConstraintAt(Rule aConstraint, int index)
  {
    boolean wasAdded = false;
    if(constraints.contains(aConstraint))
    {
      if(index < 0 ) { index = 0; }
      if(index > numberOfConstraints()) { index = numberOfConstraints() - 1; }
      constraints.remove(aConstraint);
      constraints.add(index, aConstraint);
      wasAdded = true;
    } 
    else 
    {
      wasAdded = addConstraintAt(aConstraint, index);
    }
    return wasAdded;
  }

  public void delete()
  {
    while (rules.size() > 0)
    {
      Rule aRule = rules.get(rules.size() - 1);
      aRule.delete();
      rules.remove(aRule);
    }
    
    for(int i=constraints.size(); i > 0; i--)
    {
      Rule aConstraint = constraints.get(i - 1);
      aConstraint.delete();
    }
    super.delete();
  }

}