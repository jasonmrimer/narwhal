package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.event.EventJSON;
import mil.af.us.narwhal.event.EventStatus;
import mil.af.us.narwhal.event.EventType;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.site.Site;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CrewServiceTest {
  @Mock private MissionRepository missionRepository;
  @Mock private AirmanRepository airmanRepository;
  @Captor private ArgumentCaptor<Mission> captor;

  @Test
  public void save_savesCrew() {
    Airman airman = new Airman();
    airman.setId(1L);

    Mission mission = new Mission(
      1L,
      "mission-id-1",
      "MISNUM1",
      Instant.parse("2017-12-12T09:00:00Z"),
      Instant.parse("2017-12-12T15:00:00Z"),
      "U-2",
      new Site("Site-1"),
      Instant.now()
    );

    EventJSON json = new EventJSON(
      mission.getId(),
      mission.getAtoMissionNumber(),
      "Crazy Mission",
      mission.getStartDateTime(),
      mission.getEndDateTime(),
      EventType.MISSION,
      EventStatus.APPROVED,
      airman.getId()
    );

    when(missionRepository.save(any(Mission.class))).thenReturn(mission);
    when(missionRepository.findOne(json.getId())).thenReturn(mission);
    when(airmanRepository.findOne(json.getAirmanId())).thenReturn(airman);

    CrewService subject = new CrewService(missionRepository, airmanRepository);
    subject.save(json);

    verify(missionRepository).save(captor.capture());
    Mission value = captor.getValue();
    List<CrewPosition> positions = value.getCrewPositions();
    assertThat(positions.size()).isEqualTo(1);
    assertThat(positions.get(0).getAirman().getId()).isEqualTo(airman.getId());
  }
}