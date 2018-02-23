package mil.af.us.narwhal.profile;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

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

    if (profile == null) {
      profile = repository.save(new Profile(user.getUsername(), null));
    }

    return profile;
  }

  @PutMapping
  public Profile update(@AuthenticationPrincipal User user, @RequestBody Profile profile) {
    return repository.save(profile);
  }
}
