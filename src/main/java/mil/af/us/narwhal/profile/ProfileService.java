package mil.af.us.narwhal.profile;

import org.springframework.stereotype.Service;

@Service
public class ProfileService {
  private ProfileRepository profileRepository;
  private RoleRepository roleRepository;

  public ProfileService(ProfileRepository profileRepository, RoleRepository roleRepository) {
    this.profileRepository = profileRepository;
    this.roleRepository = roleRepository;
  }

  public Profile getProfile(String username) {
    Profile profile = profileRepository.findOneByUsername(username);
    if (profile == null) {
      final Role role = roleRepository.findByName(RoleName.READER);
      profile = profileRepository.save(new Profile(username, role));
    }
    return profile;
  }

  public Profile updateSiteId(Profile profile, Long siteId) {
    profile.setSiteId(siteId);
    return profileRepository.save(profile);
  }
}
