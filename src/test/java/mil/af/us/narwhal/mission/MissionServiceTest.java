package mil.af.us.narwhal.mission;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;

import static java.util.Arrays.asList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class MissionServiceTest {
  List<Site> site1List;
  List<Site> site2List;

  public static final ZoneId ZONE_ID = ZoneId.of("Z");

  @Mock private MissionRepository missionRepository;
  @Mock private SiteRepository siteRepository;
  @Captor private ArgumentCaptor<List<Mission>> captor;
  private MissionService subject;

  @Test
  public void refreshMissions() {
    Site site1 = new Site(1L, "DGS-1");
    Site site2 = new Site(2L, "DGS-2");
    site1List = Collections.singletonList(site1);
    site2List = Collections.singletonList(site2);

    when(siteRepository.findAll()).thenReturn(asList(site1, site2));
    when(siteRepository.findByName(site1.getName())).thenReturn(site1List);
    when(siteRepository.findByName(site2.getName())).thenReturn(site2List);

    subject = new MissionService(missionRepository, new MissionClientStub(), siteRepository);
    subject.refreshMissions();
    verify(missionRepository).save(captor.capture());
    Assertions.assertThat(captor.getValue()).containsExactlyInAnyOrder(
      new Mission("1", "A", ZonedDateTime.of(2017, 1, 1, 1, 30, 0, 0, ZONE_ID), ZonedDateTime.of(2017, 1, 1, 11, 30, 0, 0, ZONE_ID), new Site(1L, "DGS-1")),
      new Mission("2", "B", ZonedDateTime.of(2017, 2, 2, 2, 0, 0, 0, ZONE_ID), ZonedDateTime.of(2017, 2, 2, 14, 0, 0, 0, ZONE_ID), new Site(1L, "DGS-1")),
      new Mission("3", "C", ZonedDateTime.of(2017, 3, 3, 3, 0, 0, 0, ZONE_ID), null, new Site(2L, "DGS-2"))
    );
  }
}