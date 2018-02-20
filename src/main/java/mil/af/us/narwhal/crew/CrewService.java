package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import org.springframework.stereotype.Service;

@Service
public class CrewService {
  private CrewRepository crewRepository;
  private MissionRepository missionRepository;
  private AirmanRepository airmanRepository;

  public CrewService(
    CrewRepository crewRepository,
    MissionRepository missionRepository,
    AirmanRepository airmanRepository
  ) {
    this.crewRepository = crewRepository;
    this.missionRepository = missionRepository;
    this.airmanRepository = airmanRepository;
  }

  public Event save(Event event) {
    Airman airman = airmanRepository.findOne(event.getAirmanId());
    Mission mission = missionRepository.findOneByMissionId(event.getTitle());
    Crew crew = crewRepository.findOneByMission(mission);
    if (crew == null) {
      crew = new Crew(mission);
    }

    CrewPosition position = new CrewPosition(crew, airman);
    crew.addCrewPosition(position);

    crew = crewRepository.save(crew);
    return crew.getMission().toEvent(crew.getId(), event.getAirmanId());
  }
}
