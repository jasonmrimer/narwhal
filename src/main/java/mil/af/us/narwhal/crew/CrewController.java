package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.event.EventJSON;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.profile.Profile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(CrewController.URI)
public class CrewController {
  public static final String URI = "/api/crews";

  private CrewPositionRepository crewPositionRepository;
  private CrewService crewService;
  private MissionRepository missionRepository;

  public CrewController(CrewPositionRepository crewPositionRepository, CrewService crewService, MissionRepository missionRepository) {
    this.crewPositionRepository = crewPositionRepository;
    this.crewService = crewService;
    this.missionRepository = missionRepository;
  }

  @GetMapping(value = "/{id}")
  public CrewJSON show(@PathVariable Long id) {
    return missionRepository.findOne(id).toCrewJSON();
  }

  @PutMapping
  public Event create(@Valid @RequestBody EventJSON json) {
    return crewService.save(json);
  }

  @DeleteMapping(value = "/{id}/airmen/{airmanId}")
  public void delete(@PathVariable Long id, @PathVariable Long airmanId) {
    crewPositionRepository.deleteOneByMissionIdAndAirmanId(id, airmanId);
  }
}
