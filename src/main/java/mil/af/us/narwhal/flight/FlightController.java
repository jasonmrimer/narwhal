package mil.af.us.narwhal.flight;

import mil.af.us.narwhal.airman.AirmanController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping(AirmanController.URI)
public class FlightController {
  public static final String URI = "/api/flights";
  private FlightRepository flightRepository;

  public FlightController(
    FlightRepository flightRepository
  ) {
    this.flightRepository = flightRepository;
  }

  @PostMapping
  public ResponseEntity<Flight> createFlight(
    @Valid
    @RequestBody FlightJSON flight) {
    Flight newFlight = new Flight(flight.getName());
    flightRepository.save(newFlight);
    return new ResponseEntity<>(newFlight, HttpStatus.CREATED);
  }
}
