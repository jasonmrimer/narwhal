package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import mil.af.us.narwhal.squadron.SquadronRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AdminSquadronServiceTest {
  @Mock private SiteRepository siteRepository;
  @Mock private SquadronRepository squadronRepository;
  private AdminSquadronService subject;

  @Before
  public void setUp() { subject = new AdminSquadronService(siteRepository, squadronRepository); }

  @Test
  public void testCreateSquadron() {
    final Site site = new Site();
    site.setId(1L);
    site.setName("SiteOne");

    final AdminSquadronItemJSON adminSquadronItemJSON = new AdminSquadronItemJSON(
      site.getId(),
      site.getName(),
      null,
      "SquadronOne"
    );

    when(siteRepository.findOne(1L))
      .thenReturn(site);

    when(squadronRepository.save(any(Squadron.class)))
      .thenAnswer((Answer<Squadron>) invocation -> {
        final Squadron squadron = (Squadron) invocation.getArguments()[0];
        squadron.setId(32L);
        return squadron;
      });

    AdminSquadronItemJSON returnedJSON = subject.createSquadron(adminSquadronItemJSON);

    assertThat(returnedJSON.getSiteId()).isEqualTo(1L);
    assertThat(returnedJSON.getSiteName()).isEqualTo("SiteOne");
    assertThat(returnedJSON.getSquadronId()).isEqualTo(32L);
    assertThat(returnedJSON.getSquadronName()).isEqualTo("SquadronOne");
  }
}
