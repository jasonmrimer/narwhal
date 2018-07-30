package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import mil.af.us.narwhal.squadron.SquadronRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(AdminSquadronController.URI)
public class AdminSquadronController{
  public static final String URI = "/api/admin/squadrons";
  private SiteRepository siteRepository;
  private SquadronRepository squadronRepository;
  private FlightRepository flightRepository;

  public AdminSquadronController(
    FlightRepository flightRepository,
    SiteRepository siteRepository,
    SquadronRepository squadronRepository
  ) {
    this.flightRepository = flightRepository;
    this.siteRepository = siteRepository;
    this.squadronRepository = squadronRepository;
  }

  @GetMapping
  public List<AdminSquadronItemJSON> index() {
    final Object[][] results = this.squadronRepository.getAdminSquadrons();
    return Arrays
      .stream(results)
      .map(o -> new AdminSquadronItemJSON(
        Long.parseLong(o[0].toString()),
        o[1].toString(),
        Long.parseLong(o[2].toString()),
        o[3].toString(),
        Long.parseLong(o[4].toString())))
      .collect(Collectors.toList());
  }

  @PostMapping
  public ResponseEntity<AdminSquadronItemJSON> createAdminSquadronItem(@RequestBody AdminSquadronItemJSON item) {
    final AdminSquadronService adminSquadronService = new AdminSquadronService(
      this.siteRepository,
      this.squadronRepository
    );
    return new ResponseEntity<>(adminSquadronService.createSquadron(item), HttpStatus.CREATED);
  }

  @DeleteMapping(value = "/{id}")
  public void delete(@PathVariable Long id) {
    Squadron squadron = squadronRepository.findOne(id);
    System.out.println(squadron == null);
    List<Flight> flights = flightRepository.findAllBySquadron(squadron);
    flights.stream().forEach(f -> flightRepository.delete(f.getId()));
    squadronRepository.delete(id);
  }
}

