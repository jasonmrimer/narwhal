package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.mission.MissionRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(CrewController.URI)
public class CrewController {
  public static final String URI = "/api/crews";

  private CrewPositionRepository crewPositionRepository;
  private MissionRepository missionRepository;

  public CrewController(CrewPositionRepository crewPositionRepository, MissionRepository missionRepository) {
    this.crewPositionRepository = crewPositionRepository;
    this.missionRepository = missionRepository;
  }

  @GetMapping(value = "/{id}")
  public CrewJSON show(@PathVariable Long id) {
    return missionRepository.findOne(id).toCrewJSON();
  }

  @DeleteMapping(value = "/{id}/airmen/{airmanId}")
  public void delete(@PathVariable Long id, @PathVariable Long airmanId) {
    crewPositionRepository.deleteOneByMissionIdAndAirmanId(id, airmanId);
  }
}
