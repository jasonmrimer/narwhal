package mil.af.us.narwhal.profile;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
  public List<ProfileJSON> index() {
    return this.profileService.getAllProfiles().stream()
      .map(profile -> profile.toProfileJSON(classified))
      .collect(Collectors.toList());
  }

  @GetMapping(path = "/me")
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
