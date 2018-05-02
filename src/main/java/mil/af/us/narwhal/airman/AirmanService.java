package mil.af.us.narwhal.airman;

import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirmanService {
  private AirmanRepository airmanRepository;
  private FlightRepository flightRepository;

  public AirmanService(AirmanRepository airmanRepository, FlightRepository flightRepository) {
    this.airmanRepository = airmanRepository;
    this.flightRepository = flightRepository;
  }

  public Airman getAirman(Long airmanId) {
    return airmanRepository.findOne(airmanId);
  }

  public List<Airman> getAirmenBySite(Long siteId) {
    return airmanRepository.findAllBySiteIdAndByOrderByLastName(siteId);
  }

  public Airman updateAirman(AirmanJSON json) {
    final Airman airman = airmanRepository.findOne(json.getId());
    final Flight flight = flightRepository.findOne(json.getFlightId());

    airman.setFirstName(json.getFirstName());
    airman.setLastName(json.getLastName());

    airman.setFlight(flight);

    airman.setShift(json.getShift());

    json.getSchedules().stream()
      .filter(airmanSchedule -> airmanSchedule.getId() == null)
      .findFirst()
      .ifPresent(airman::addSchedule);

    return airmanRepository.save(airman);
  }
}
