package mil.af.us.narwhal.profile;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ProfileController.URI)
public class ProfileController {
  public static final String URI = "/api/profiles";

  @Value("${classified}") private Boolean classified;
  private ProfileService profileService;

  public ProfileController(ProfileService profileService) {
    this.profileService = profileService;
  }

  @GetMapping
  public ProfileJSON show(@AuthenticationPrincipal Profile profile) {
    return profile.toProfileJSON(classified);
  }

  @PutMapping
  public ProfileJSON updateSiteId(
    @AuthenticationPrincipal Profile profile,
    @RequestParam Long siteId
  ) {
    return profileService.updateSiteId(profile, siteId).toProfileJSON(classified);
  }
}
