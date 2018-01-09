package mil.af.us.narwhal.airman;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(AirmanController.URI)
public class AirmanController {
  public static final String URI = "/api/airmen";

  private AirmanRepository airmanRepository;

  public AirmanController(AirmanRepository airmanRepository) {
    this.airmanRepository = airmanRepository;
  }

  @GetMapping
  public List<Airman> index() {
    return airmanRepository.findAll();
  }

  @GetMapping(params = {"squadron"})
  public List<Airman> indexSquadronId(@RequestParam("squadron") Long squadronId) {
    return airmanRepository.findBySquadronId(squadronId);
  }

  @GetMapping(params = {"flight"})
  public List<Airman> indexByFlightId(@RequestParam("flight") Long flightId) {
    return airmanRepository.findByFlightId(flightId);
  }
}
