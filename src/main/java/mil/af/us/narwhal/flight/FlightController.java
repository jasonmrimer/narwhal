package mil.af.us.narwhal.flight;

import mil.af.us.narwhal.squadron.Squadron;
import mil.af.us.narwhal.squadron.SquadronRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping(FlightController.URI)
public class FlightController {
  public static final String URI = "/api/flights";
  private SquadronRepository squadronRepository;
  private FlightRepository flightRepository;

  public FlightController(
    FlightRepository flightRepository,
    SquadronRepository squadronRepository
  ) {
    this.flightRepository = flightRepository;
    this.squadronRepository = squadronRepository;
  }

  @PostMapping
  public ResponseEntity<Flight> createFlight(
    @Valid
    @RequestBody FlightJSON flightJSON
  ) {
    Squadron squadron = squadronRepository.findOne(flightJSON.getSquadronId());
    Flight flight = new Flight(squadron, flightJSON.getName());
    flightRepository.save(flight);
    return new ResponseEntity<>(flight, HttpStatus.CREATED);
  }
}
