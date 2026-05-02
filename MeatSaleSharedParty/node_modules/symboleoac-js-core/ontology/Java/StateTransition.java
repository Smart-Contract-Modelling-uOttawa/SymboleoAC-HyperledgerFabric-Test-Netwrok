/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

/**
 * For Access Control
 */
// line 240 "model.ump"
// line 358 "model.ump"
public class StateTransition extends Resource
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //StateTransition Associations
  private LegalPosition legalpositionST;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public StateTransition(LegalPosition aLegalpositionST, Role... allControllers)
  {
    super(allControllers);
    if (aLegalpositionST == null || aLegalpositionST.getStateTransition() != null)
    {
      throw new RuntimeException("Unable to create StateTransition due to aLegalpositionST. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
    }
    legalpositionST = aLegalpositionST;
  }

  public StateTransition(LegalSituation aAntecedentForLegalpositionST, LegalSituation aConsequentForLegalpositionST, Contract aContractForLegalpositionST, Role aDebtorForLegalpositionST, Role aCreditorForLegalpositionST, Role... allControllersForLegalpositionST, Role... allControllers)
  {
    super(allControllers);
    legalpositionST = new LegalPosition(aAntecedentForLegalpositionST, aConsequentForLegalpositionST, this, aContractForLegalpositionST, aDebtorForLegalpositionST, aCreditorForLegalpositionST, allControllersForLegalpositionST);
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetOne */
  public LegalPosition getLegalpositionST()
  {
    return legalpositionST;
  }

  public void delete()
  {
    LegalPosition existingLegalpositionST = legalpositionST;
    legalpositionST = null;
    if (existingLegalpositionST != null)
    {
      existingLegalpositionST.delete();
    }
    super.delete();
  }

}