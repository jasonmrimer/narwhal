package mil.af.us.narwhal.roster;

import mil.af.us.narwhal.airman.AirmanRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roster")
public class RosterController {
  private AirmanRepository airmanRepository;

  public RosterController(AirmanRepository airmanRepository) {
    this.airmanRepository = airmanRepository;
  }

  @GetMapping
  public Roster index() {
    return new Roster(airmanRepository.findAll());
  }

  @GetMapping(params = {"unit"})
  public Roster index(@RequestParam("unit") Long unitId) {
    return new Roster(airmanRepository.findByUnitId(unitId));
  }
}
