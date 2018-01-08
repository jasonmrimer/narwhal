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

  @GetMapping(params = {"unit"})
  public List<Airman> indexUnitId(@RequestParam("unit") Long unitId) {
    return airmanRepository.findByUnitId(unitId);
  }

  @GetMapping(params = {"flight"})
  public List<Airman> indexByFlightId(@RequestParam("flight") Long flightId) {
    return airmanRepository.findByFlightId(flightId);
  }
}
