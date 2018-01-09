package mil.af.us.narwhal.squadron;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(SquadronController.URI)
public class SquadronController {
  public static final String URI = "/api/squadrons";

  SquadronRepository squadronRepository;

  public SquadronController(SquadronRepository squadronRepository) {
    this.squadronRepository = squadronRepository;
  }

  @GetMapping
  public List<Squadron> index() {
    return squadronRepository.findAll();
  }
}
