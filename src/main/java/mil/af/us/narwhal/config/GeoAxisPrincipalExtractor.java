package mil.af.us.narwhal.config;

import mil.af.us.narwhal.profile.ProfileService;
import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;

import java.util.Map;

public class GeoAxisPrincipalExtractor implements PrincipalExtractor {
  private ProfileService profileService;

  public GeoAxisPrincipalExtractor(ProfileService profileService) {
    this.profileService = profileService;
  }

  @Override
  public Object extractPrincipal(Map<String, Object> map) {
    return profileService.getProfile((String) map.get("user_name"));
  }
}
