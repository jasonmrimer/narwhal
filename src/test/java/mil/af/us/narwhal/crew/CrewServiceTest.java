package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.event.Event;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CrewServiceTest {

  @Mock private CrewRepository crewRepository;
  @Mock private MissionRepository missionRepository;
  @Mock private AirmanRepository airmanRepository;
  @Captor private ArgumentCaptor<Crew> captor;
  private CrewService subject;

  @Test
  public void save_savesCrew() {
    Airman airman = new Airman();
    airman.setId(1L);

    Mission mission =  new Mission(
      "mission-id-1",
      "MISNUM1",
      Instant.parse("2017-12-12T09:00:00Z"),
      Instant.parse("2017-12-12T15:00:00Z"),
      new Site("Site-1")
    );
    Crew crew = new Crew(mission);
    crew.addCrewPosition(new CrewPosition(crew, airman));
    Event event = new Event(
      mission.getAtoMissionNumber(),
      "Crazy Mission",
      mission.getStartDateTime(),
      mission.getEndDateTime(),
      EventType.MISSION,
      airman.getId()
    );

    when(crewRepository.save(any(Crew.class))).thenReturn(crew);
    when(crewRepository.findOneByMission(mission)).thenReturn(null);
    when(missionRepository.findOneByMissionId(event.getTitle())).thenReturn(mission);
    when(airmanRepository.findOne(event.getAirmanId())).thenReturn(airman);

    subject = new CrewService(crewRepository, missionRepository, airmanRepository);
    subject.save(event);

    verify(crewRepository).save(captor.capture());
    Crew value = captor.getValue();
    assertThat(value).isEqualToComparingOnlyGivenFields(crew, "mission", "id");
  }
}