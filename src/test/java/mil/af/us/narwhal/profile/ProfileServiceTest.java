package mil.af.us.narwhal.profile;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProfileServiceTest {
  @Mock private ProfileRepository profileRepository;
  @Mock private RoleRepository roleRepository;
  private ProfileService subject;

  @Before
  public void setUp() {
    subject = new ProfileService(profileRepository, roleRepository);
  }

  @Test
  public void getsTheProfileGivenTheUsername() {
    subject.getProfile("username");
    verify(profileRepository).findOneByUsername("username");
  }

  @Test
  public void createsAProfileIfOneDoesNotExist() {
    final Role role = new Role(134L, RoleName.READER);

    when(roleRepository.findByName(RoleName.READER))
      .thenReturn(role);
    when(subject.getProfile("username"))
      .thenReturn(null);

    subject.getProfile("username");

    verify(profileRepository).save(new Profile("username", role));
  }

  @Test
  public void updatesSiteIdOnProfile() {
    final Role role = new Role(134L, RoleName.READER);
    Profile profile = new Profile(1L, "username", role);

    subject.updateSiteId(profile, 2L);

    profile.setSiteId(2L);
    verify(profileRepository).save(profile);
  }
}