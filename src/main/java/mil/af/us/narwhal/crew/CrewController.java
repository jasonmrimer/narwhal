package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.event.EventJSON;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(CrewController.URI)
public class CrewController {
  public static final String URI = "/api/crews";

  private CrewPositionRepository crewPositionRepository;
  private CrewService crewService;
  private MissionRepository missionRepository;
  private TemplateItemRepository templateItemRepository;

  public CrewController(
    CrewPositionRepository crewPositionRepository,
    CrewService crewService,
    MissionRepository missionRepository,
    TemplateItemRepository templateItemRepository
  ) {
    this.crewPositionRepository = crewPositionRepository;
    this.crewService = crewService;
    this.missionRepository = missionRepository;
    this.templateItemRepository = templateItemRepository;
  }

  @GetMapping(value = "/{id}")
  public CrewJSON show(@PathVariable Long id) {
    Mission mission = missionRepository.findOne(id);

    if (mission.getCrewPositions().size() == 0) {
      List<TemplateItem> ourItems = this.templateItemRepository.findAllByTemplateIdOrderByOrder(1L);

      List<CrewPosition> defaultPositions =
        ourItems
        .stream()
        .map(x ->
          new CrewPosition(
            x.getCritical(),
            x.getOrder(),
            x.getTemplateId(),
            ""
          )
        ).collect(Collectors.toList());

      mission.setCrewPositions(defaultPositions);
    }

    return mission.toCrewJSON();
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
