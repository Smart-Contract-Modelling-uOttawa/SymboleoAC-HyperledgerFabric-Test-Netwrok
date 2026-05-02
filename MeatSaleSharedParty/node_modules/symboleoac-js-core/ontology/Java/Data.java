/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.34.0.7242.6b8819789 modeling language!*/


import java.util.*;

/**
 * For Access Control
 */
// line 234 "model.ump"
// line 353 "model.ump"
public class Data extends AbstractEvent
{

  //------------------------
  // MEMBER VARIABLES
  //------------------------

  //Data Associations
  private LegalSituation legalSituationD;

  //------------------------
  // CONSTRUCTOR
  //------------------------

  public Data(Role[] allControllers, Attribute[] allAttributes)
  {
    super(allControllers, allAttributes);
  }

  //------------------------
  // INTERFACE
  //------------------------
  /* Code from template association_GetOne */
  public LegalSituation getLegalSituationD()
  {
    return legalSituationD;
  }

  public boolean hasLegalSituationD()
  {
    boolean has = legalSituationD != null;
    return has;
  }
  /* Code from template association_SetOptionalOneToMany */
  public boolean setLegalSituationD(LegalSituation aLegalSituationD)
  {
    boolean wasSet = false;
    LegalSituation existingLegalSituationD = legalSituationD;
    legalSituationD = aLegalSituationD;
    if (existingLegalSituationD != null && !existingLegalSituationD.equals(aLegalSituationD))
    {
      existingLegalSituationD.removeData(this);
    }
    if (aLegalSituationD != null)
    {
      aLegalSituationD.addData(this);
    }
    wasSet = true;
    return wasSet;
  }

  public void delete()
  {
    if (legalSituationD != null)
    {
      LegalSituation placeholderLegalSituationD = legalSituationD;
      this.legalSituationD = null;
      placeholderLegalSituationD.removeData(this);
    }
    super.delete();
  }

}