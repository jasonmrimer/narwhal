package mil.af.us.narwhal.mission;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static java.util.Collections.singletonList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class MissionServiceTest {
  public static final ZoneId ZONE_ID = ZoneId.of("Z");

  private final Site site1 = new Site(1L, "DGS-1");
  private final Site site2 = new Site(2L, "DGS-2");

  @Mock private MissionRepository missionRepository;
  @Mock private SiteRepository siteRepository;
  @Mock private MissionClient missionClient;
  @Captor private ArgumentCaptor<List<Mission>> captor;
  private MissionService subject;


  @Before
  public void setUp() {
    when(siteRepository.findOneByName(site1.getName())).thenReturn(site1);
    when(siteRepository.findOneByName(site2.getName())).thenReturn(site2);
  }

  @Test
  public void refreshMissions_savesMissions() {
    subject = new MissionService(missionRepository, new MissionClientStub(), siteRepository);
    subject.refreshMissions();

    verify(missionRepository).save(captor.capture());
    Assertions.assertThat(captor.getValue()).containsExactlyInAnyOrder(
      new Mission(
        "1",
        "A",
        ZonedDateTime.of(2017, 1, 1, 1, 30, 0, 0, ZONE_ID),
        ZonedDateTime.of(2017, 1, 1, 11, 30, 0, 0, ZONE_ID),
        new Site(1L, "DGS-1")
      ),
      new Mission(
        "2",
        "B",
        ZonedDateTime.of(2017, 2, 2, 2, 0, 0, 0, ZONE_ID),
        ZonedDateTime.of(2017, 2, 2, 14, 0, 0, 0, ZONE_ID),
        new Site(1L, "DGS-1")
      ),
      new Mission(
        "3",
        "C",
        ZonedDateTime.of(2017, 3, 3, 3, 0, 0, 0, ZONE_ID),
        null,
        new Site(2L, "DGS-2")
      )
    );
  }

  @Test
  public void refreshMissions_handlesNonUniformDates() {
    when(missionClient.getMissionMetaData()).thenReturn(singletonList(
      new MissionMetaData(
        "4",
        "D",
        "04-04-2018T04:04:00.0Z",
        "04-04-2018T16:04:04.0Z",
        site1.getName()
      )
    ));

    subject = new MissionService(missionRepository, missionClient, siteRepository);
    subject.refreshMissions();

    verify(missionRepository).save(captor.capture());
    Assertions.assertThat(captor.getValue()).containsExactlyInAnyOrder(
      new Mission(
        "4",
        "D",
        ZonedDateTime.of(2018, 4, 4, 4, 4, 0, 0, ZONE_ID),
        ZonedDateTime.of(2018, 4, 4, 16, 4, 4, 0, ZONE_ID),
        site1
      )
    );
  }

  @Test
  public void refreshMissions_handlesUnknownSites() {
    when(missionClient.getMissionMetaData()).thenReturn(singletonList(
      new MissionMetaData(
        "5",
        "E",
        "05-05-2018T05:05:00.0Z",
        "05-05-2018T17:05:05.0Z",
        "not a site"
      )
    ));

    subject = new MissionService(missionRepository, missionClient, siteRepository);
    subject.refreshMissions();

    verify(missionRepository).save(captor.capture());
    Assertions.assertThat(captor.getValue()).containsExactlyInAnyOrder(
      new Mission(
        "5",
        "E",
        ZonedDateTime.of(2018, 5, 5, 5, 5, 0, 0, ZONE_ID),
        ZonedDateTime.of(2018, 5, 5, 17, 5, 5, 0, ZONE_ID),
        null
      )
    );
  }
}