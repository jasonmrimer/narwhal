package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.airman.AirmanRepository;
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

  private CrewRepository crewRepository;
  private AirmanRepository airmanRepository;

  public CrewController(CrewRepository crewRepository, AirmanRepository airmanRepository) {
    this.crewRepository = crewRepository;
    this.airmanRepository = airmanRepository;
  }

  @GetMapping(value = "/{id}")
  public Crew show(@PathVariable Long id) {
    return crewRepository.findOne(id);
  }

  @PutMapping(value = "/{id}/positions")
  public Crew update(@PathVariable Long id, @RequestBody List<CrewPositionJSON> positions) {
    final Crew crew = crewRepository.findOne(id);

    final Map<Long, CrewPositionJSON> airmanIdAndPosition = positions.stream()
      .map(position -> {
        if (position.getId() != null) {
          crew.updatePosition(position.getId(), position.getTitle(), position.getCritical());
          return null;
        }
        return position;
      })
      .filter(Objects::nonNull)
      .collect(toMap(CrewPositionJSON::getAirmanId, identity()));

    airmanRepository.findAll(airmanIdAndPosition.keySet()).forEach(airman -> {
      final CrewPositionJSON json = airmanIdAndPosition.get(airman.getId());
      crew.addCrewPosition(new CrewPosition(airman, json.getTitle(), json.getCritical()));
    });

    return crewRepository.save(crew);
  }
}
