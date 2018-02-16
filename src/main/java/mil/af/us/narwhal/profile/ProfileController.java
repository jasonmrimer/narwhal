package mil.af.us.narwhal.profile;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ProfileController.URI)
public class ProfileController {
  public static final String URI = "/api/profiles";

  private ProfileRepository repository;

  public ProfileController(ProfileRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public Profile show(@AuthenticationPrincipal User user) {
    Profile profile = repository.findOneByUsername(user.getUsername());
    return profile != null ? profile : new Profile(user.getUsername(), -1L);
  }
}
