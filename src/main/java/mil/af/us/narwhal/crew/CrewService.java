package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.event.EventJSON;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import org.springframework.stereotype.Service;

@Service
public class CrewService {
  private MissionRepository missionRepository;
  private AirmanRepository airmanRepository;

  public CrewService(
    MissionRepository missionRepository,
    AirmanRepository airmanRepository
  ) {
    this.missionRepository = missionRepository;
    this.airmanRepository = airmanRepository;
  }

  public Event save(EventJSON event) {
    Airman airman = airmanRepository.findOne(event.getAirmanId());
    Mission mission = missionRepository.findOne(event.getId());
    mission.addCrewPosition(new CrewPosition(airman));
    return missionRepository.save(mission).toEvent(event.getAirmanId());
  }
}
