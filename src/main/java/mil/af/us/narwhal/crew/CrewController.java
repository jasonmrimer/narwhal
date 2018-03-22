package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;

@RestController
@RequestMapping(CrewController.URI)
public class CrewController {
  public static final String URI = "/api/crews";

  private CrewPositionRepository crewPositionRepository;
  private AirmanRepository airmanRepository;
  private MissionRepository missionRepository;

  public CrewController(CrewPositionRepository crewPositionRepository, AirmanRepository airmanRepository, MissionRepository missionRepository) {
    this.crewPositionRepository = crewPositionRepository;
    this.airmanRepository = airmanRepository;
    this.missionRepository = missionRepository;
  }

  @GetMapping(value = "/{id}")
  public CrewJSON show(@PathVariable Long id) {
    return missionRepository.findOne(id).toCrewJSON();
  }

  @PutMapping(value = "/{id}/positions")
  public CrewJSON update(@PathVariable Long id, @RequestBody List<CrewPositionJSON> positions) {
    final Mission mission = missionRepository.findOne(id);

    final Map<Long, CrewPositionJSON> airmanIdAndPosition = positions.stream()
      .map(position -> {
        if (position.getId() != null) {
          mission.updatePosition(position.getId(), position.getTitle(), position.isCritical());
          return null;
        }
        return position;
      })
      .filter(Objects::nonNull)
      .collect(toMap(CrewPositionJSON::getAirmanId, identity()));

    airmanRepository.findAll(airmanIdAndPosition.keySet()).forEach(airman -> {
      final CrewPositionJSON json = airmanIdAndPosition.get(airman.getId());
      mission.addCrewPosition(new CrewPosition(airman, json.getTitle(), json.isCritical()));
    });

    return missionRepository.save(mission).toCrewJSON();
  }

  @DeleteMapping(value = "/{id}/airmen/{airmanId}")
  public void delete(@PathVariable Long id, @PathVariable Long airmanId) {
    crewPositionRepository.deleteOneByMissionIdAndAirmanId(id, airmanId);
  }
}
