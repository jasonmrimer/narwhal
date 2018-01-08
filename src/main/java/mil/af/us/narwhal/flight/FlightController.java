package mil.af.us.narwhal.flight;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(FlightController.URI)
public class FlightController {
  public static final String URI = "/api/flights";

  FlightRepository flightRepository;

  public FlightController(FlightRepository flightRepository) {
    this.flightRepository = flightRepository;
  }

  @GetMapping
  public List<Flight> index() {
    return flightRepository.findAll();
  }
}
