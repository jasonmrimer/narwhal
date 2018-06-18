package mil.af.us.narwhal.profile;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import static org.assertj.core.api.Java6Assertions.assertThat;

import static java.util.Collections.emptyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProfileServiceTest {
  @Mock private ProfileRepository profileRepository;
  @Mock private RoleRepository roleRepository;
  @Mock private SiteRepository siteRepository;
  private ProfileService subject;

  @Before
  public void setUp() {
    subject = new ProfileService(profileRepository, roleRepository, siteRepository);
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
  public void updateSite() {
    final Site site = new Site(2L, "Test Site", emptyList());
    final Profile profile = new Profile(1L, "username", new Role(123L, RoleName.READER));

    when(profileRepository.findOne(profile.getId()))
      .thenReturn(profile);

    when(siteRepository.findOne(site.getId()))
      .thenReturn(site);

    subject.setSite(profile, site.getId());

    profile.setSite(site);
    verify(profileRepository).save(profile);
  }

  @Test
  public void updateRole() {
    final Role updatedRole = new Role(456L, RoleName.WRITER);
    final Profile profile = new Profile(
      1L,
      "Joshua",
      new Role(123L, RoleName.READER)
    );

    when(profileRepository.findOne(profile.getId()))
      .thenReturn(profile);

    when(roleRepository.findOne(updatedRole.getId()))
      .thenReturn(updatedRole);

    ProfileJSON json = profile.toProfileJSON(true);
    json.setRoleId(updatedRole.getId());
    subject.update(json);

    profile.setRole(updatedRole);
    verify(profileRepository).save(profile);
  }

  @Test
  public void resetSiteAndSquadron(){
    final Site site = new Site(2L, "Test Site", emptyList());
    final Profile profile = new Profile("username", site, 1L);
    subject.resetSiteAndSquadron(profile);

    assertThat(profile.getSite()).isNull();
    assertThat(profile.getSquadronId()).isNull();
    verify(profileRepository).save(profile);
  }
}