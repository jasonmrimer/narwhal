package mil.af.us.narwhal.airman;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(AirmanController.URI)
public class AirmanController {
  public static final String URI = "/api/airmen";

  private AirmanRepository repository;

  public AirmanController(AirmanRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<Airman> index() {
    return repository.findAll();
  }

  @GetMapping(params = {"squadron"})
  public List<Airman> indexSquadronId(@RequestParam("squadron") Long squadronId) {
    return repository.findBySquadronId(squadronId);
  }

  @GetMapping(params = {"flight"})
  public List<Airman> indexByFlightId(@RequestParam("flight") Long flightId) {
    return repository.findByFlightId(flightId);
  }

  @PostMapping(path = "/{id}/qualifications")
  public ResponseEntity<Airman> createAirmanQualification(
    @PathVariable("id") Long id,
    @RequestBody AirmanQualification qualification
  ) {
    final Airman airman = repository.findOne(id);
    return airman.addQualification(qualification) ?
      new ResponseEntity<>(repository.save(airman), HttpStatus.CREATED) :
      new ResponseEntity<>(airman, HttpStatus.OK);
  }

  @PostMapping(path = "/{id}/certifications")
  public ResponseEntity<Airman> createAirmanCertification(
    @PathVariable("id") Long id,
    @RequestBody AirmanCertification certification
  ) {
    final Airman airman = repository.findOne(id);
    return airman.addCertification(certification) ?
      new ResponseEntity<>(repository.save(airman), HttpStatus.CREATED) :
      new ResponseEntity<>(airman, HttpStatus.OK);
  }
}
