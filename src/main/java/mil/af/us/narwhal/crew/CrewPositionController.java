package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
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
  public CrewJSON update(@PathVariable Long id, @RequestBody List<CrewPositionJSON> positions) {
    Mission mission = missionRepository.findOne(id);
    mission.getCrewPositions().clear();

    positions.forEach(position -> {
      final Airman airman = airmanRepository.findOne(position.getAirmanId());
      CrewPosition crewPosition = new CrewPosition();
      crewPosition.setTitle(position.getTitle());
      crewPosition.setRemarks(position.getRemarks());
      crewPosition.setCritical(position.isCritical());
      crewPosition.setAirman(airman);
      crewPosition.setMission(mission);
      crewPosition.setOrder(position.getOrder());
      crewPosition.setTemplateItemId(position.getTemplateItemId());

      if (position.getId() != null) crewPosition.setId(position.getId());
      mission.addCrewPosition(crewPosition);
    });

    mission.setUpdatedAt(Instant.now());
    missionRepository.save(mission);

    return mission.toCrewJSON();
  }

  @DeleteMapping(value = "/")
  public void delete(@RequestBody List<CrewPositionJSON> positions) {
    crewPositionRepository.delete(positions.stream()
      .map(position -> crewPositionRepository.findOne(position.getId()))
      .collect(toList()));
  }
}
