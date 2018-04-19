package mil.af.us.narwhal.profile;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {
  private ProfileRepository profileRepository;
  private RoleRepository roleRepository;
  private SiteRepository siteRepository;

  public ProfileService(
    ProfileRepository profileRepository,
    RoleRepository roleRepository,
    SiteRepository siteRepository
  ) {
    this.profileRepository = profileRepository;
    this.roleRepository = roleRepository;
    this.siteRepository = siteRepository;
  }

  public Profile getProfile(String username) {
    Profile profile = profileRepository.findOneByUsername(username);
    if (profile == null) {
      final Role role = roleRepository.findByName(RoleName.READER);
      profile = profileRepository.save(new Profile(username, role));
    }
    return profile;
  }

  public List<Profile> getAllProfiles() {
    return profileRepository.findAll();
  }

  public Profile updateSiteId(Profile profile, Long siteId) {
    final Site site = this.siteRepository.findOne(siteId);
    profile.setSite(site);
    return profileRepository.save(profile);
  }
}
