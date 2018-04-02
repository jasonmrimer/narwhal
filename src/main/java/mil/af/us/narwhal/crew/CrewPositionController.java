package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping(CrewPositionController.URI)
public class CrewPositionController {
  public static final String URI = "/api/crew_positions";

  private CrewPositionRepository crewPositionRepository;
  private MissionRepository missionRepository;
  private AirmanRepository airmanRepository;

  public CrewPositionController(
    CrewPositionRepository crewPositionRepository,
    MissionRepository missionRepository,
    AirmanRepository airmanRepository) {
    this.crewPositionRepository = crewPositionRepository;
    this.missionRepository = missionRepository;
    this.airmanRepository = airmanRepository;
  }

  @PutMapping(value = "/{id}")
  public List<CrewPosition> update(@PathVariable Long id, @RequestBody List<CrewPositionJSON> positions) {
    Mission mission = missionRepository.findOne(id);

    return crewPositionRepository.save(positions.stream()
      .map(position -> {
        CrewPosition crewPosition = new CrewPosition();
        crewPosition.setTitle(position.getTitle());
        crewPosition.setCritical(position.isCritical());
        Airman airman = airmanRepository.findOne(position.getAirmanId());
        crewPosition.setAirman(airman);
        crewPosition.setMission(mission);

        if (position.getId() != null) crewPosition.setId(position.getId());

        return crewPosition;
      })
      .collect(toList()));
  }

  @DeleteMapping(value = "/")
  public void delete(@RequestBody List<CrewPositionJSON> positions) {
    crewPositionRepository.delete(positions.stream()
      .map(position -> crewPositionRepository.findOne(position.getId()))
      .collect(toList()));
  }
}
