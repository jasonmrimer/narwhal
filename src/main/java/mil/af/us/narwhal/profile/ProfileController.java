package mil.af.us.narwhal.profile;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ProfileController.URI)
public class ProfileController {
  public static final String URI = "/api/profiles";
  @Value("${classified}") private Boolean classified;

  private ProfileRepository repository;

  public ProfileController(ProfileRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public ProfileJSON show(@AuthenticationPrincipal User user) {
    Profile profile = repository.findOneByUsername(user.getUsername());
    if (profile == null) {
      profile = repository.save(new Profile(user.getUsername(), null));
    }
    return new ProfileJSON(profile, classified);
  }

  @PutMapping
  public ProfileJSON update(@AuthenticationPrincipal User user, @RequestBody Profile profile) {
    return new ProfileJSON(repository.save(profile), classified);
  }
}
