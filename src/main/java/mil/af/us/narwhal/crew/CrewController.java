package mil.af.us.narwhal.crew;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(CrewController.URI)
public class CrewController {
  public static final String URI = "/api/crews";

  CrewRepository crewRepository;

  public CrewController(CrewRepository crewRepository) {
    this.crewRepository = crewRepository;
  }

  @GetMapping
  public List<Crew> index() {
    return crewRepository.findAll();
  }
}
