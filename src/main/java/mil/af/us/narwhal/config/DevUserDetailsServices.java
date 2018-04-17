package mil.af.us.narwhal.config;

import mil.af.us.narwhal.profile.Profile;
import mil.af.us.narwhal.profile.ProfileService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@org.springframework.context.annotation.Profile({"!cloud", "!prod"})
@Service("userDetailsService")
public class DevUserDetailsServices implements UserDetailsService {
  private ProfileService profileService;

  public DevUserDetailsServices(ProfileService profileService) {
    this.profileService = profileService;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Profile profile = profileService.getProfile(username);
    profile.setPassword("password");
    return profile;
  }
}