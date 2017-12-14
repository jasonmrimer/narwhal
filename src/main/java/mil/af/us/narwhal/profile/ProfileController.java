package mil.af.us.narwhal.profile;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(ProfileController.URI)
public class ProfileController {
  public static final String URI = "/api/profiles";

  @GetMapping
  public Map<String, String> show(@AuthenticationPrincipal User user) {
    return new HashMap<String, String>() {{
      put("username", user.getUsername());
    }};
  }
}
