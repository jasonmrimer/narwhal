package mil.af.us.narwhal.upload.airman;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AirmanUploadService {
  private AirmanRepository airmanRepository;
  private SiteRepository siteRepository;
  private FlightRepository flightRepository;

  public AirmanUploadService(
    AirmanRepository airmanRepository,
    SiteRepository siteRepository,
    FlightRepository flightRepository
  ) {
    this.airmanRepository = airmanRepository;
    this.siteRepository = siteRepository;
    this.flightRepository = flightRepository;
  }

  public void importToDatabase(List<AirmanUploadCSVRow> rows) {
    Set<Airman> airmen = new HashSet<>();

    for (AirmanUploadCSVRow row : rows) {
      Site site = siteRepository.findOneByName(row.getSite());
      if (site == null) continue;

      Squadron squadron = getSquadron(row, site);
      if (squadron == null) continue;

      Flight flight = getFlight(row, squadron);

      airmen.add(new Airman(flight.getId(), row.getFirstName(), row.getLastName()));
    }

    if (!airmen.isEmpty()) airmanRepository.save(airmen);
  }

  private Squadron getSquadron(AirmanUploadCSVRow row, Site site) {
    return site.getSquadrons()
      .stream()
      .filter(s -> s.getName().equals(row.getSquadron()))
      .findFirst()
      .orElse(null);
  }

  private Flight getFlight(AirmanUploadCSVRow row, Squadron squadron) {
    return squadron.getFlights()
      .stream()
      .filter(f -> f.getName().equals(row.getFlight()))
      .findFirst()
      .orElseGet(() -> {
        Flight flight = new Flight(row.getFlight());
        squadron.addFlight(flight);
        return flightRepository.save(flight);
      });
  }
}
