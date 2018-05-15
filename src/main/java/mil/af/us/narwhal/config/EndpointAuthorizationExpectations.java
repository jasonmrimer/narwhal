package mil.af.us.narwhal.config;

import lombok.Data;
import mil.af.us.narwhal.profile.RoleName;
import java.util.*;


@Data
public class EndpointAuthorizationExpectations {
  private String url;
  private HashMap<Boolean, List<RoleName>> statusCodeDictionaryGET = new HashMap<>();
  private HashMap<Boolean, List<RoleName>> statusCodeDictionaryDELETE = new HashMap<>();
  private HashMap<Boolean, List<RoleName>> statusCodeDictionaryPOST = new HashMap<>();
  private HashMap<Boolean, List<RoleName>> statusCodeDictionaryPUT = new HashMap<>();


  public EndpointAuthorizationExpectations(String url){ this.url = url; }

  public EndpointAuthorizationExpectations setStatusCodeDictionaryGET(HashMap<Boolean, List<RoleName>> map){
    statusCodeDictionaryGET = map;
    return this;
  }

  public EndpointAuthorizationExpectations setStatusCodeDictionaryDELETE(HashMap<Boolean, List<RoleName>> map){
    statusCodeDictionaryDELETE = map;
    return this;
  }

  public EndpointAuthorizationExpectations setStatusCodeDictionaryPOST(HashMap<Boolean, List<RoleName>> map){
    statusCodeDictionaryPOST= map;
    return this;
  }

  public EndpointAuthorizationExpectations setStatusCodeDictionaryPUT(HashMap<Boolean, List<RoleName>> map){
    statusCodeDictionaryPUT= map;
    return this;
  }
}
