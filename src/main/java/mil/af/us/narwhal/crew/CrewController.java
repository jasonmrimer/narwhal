package mil.af.us.narwhal.crew;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
