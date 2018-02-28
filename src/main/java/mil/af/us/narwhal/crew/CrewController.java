package mil.af.us.narwhal.crew;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(CrewController.URI)
public class CrewController {
  public static final String URI = "/api/crews";

  private CrewRepository crewRepository;

  public CrewController(CrewRepository crewRepository) {
    this.crewRepository = crewRepository;
  }

  @GetMapping(value = "/{id}")
  public Crew show(@PathVariable Long id) {
    return crewRepository.findOne(id);
  }

  @PutMapping(value = "/{id}/positions")
  public Crew update(@PathVariable Long id, @RequestBody List<CrewPositionJSON> positions) {
    final Crew crew = crewRepository.findOne(id);


    crew.getCrewPositions().forEach(position -> {
      positions.forEach(p -> {
        if (p.getId().equals(position.getId())) {
          position.setTitle(p.getTitle());
          position.setCritical(p.getCritical());
        }
      });
    });

    return crewRepository.save(crew);
  }
}
