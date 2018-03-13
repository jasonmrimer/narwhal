package mil.af.us.narwhal.upload.airman;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanCertification;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.skills.Certification;
import mil.af.us.narwhal.skills.CertificationRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AirmanUploadService {
  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MM/dd/yyyy");

  private AirmanRepository airmanRepository;
  private SiteRepository siteRepository;
  private FlightRepository flightRepository;
  private CertificationRepository certificationRepository;

  public AirmanUploadService(
    AirmanRepository airmanRepository,
    SiteRepository siteRepository,
    FlightRepository flightRepository,
    CertificationRepository certificationRepository
  ) {
    this.airmanRepository = airmanRepository;
    this.siteRepository = siteRepository;
    this.flightRepository = flightRepository;
    this.certificationRepository = certificationRepository;
  }

  public void importToDatabase(List<AirmanUploadCSVRow> rows) {
    Set<Airman> airmen = new HashSet<>();

    for (AirmanUploadCSVRow row : rows) {
      Site site = siteRepository.findOneByName(row.getSite());
      if (site == null) continue;

      Squadron squadron = getSquadron(row, site);
      if (squadron == null) continue;

      Flight flight = getFlight(row, squadron);

      airmen.add(new Airman(flight, row.getFirstName(), row.getLastName()));
    }

    if (!airmen.isEmpty()) airmanRepository.save(airmen);
  }

  public void attachCertifications(List<AttachCertificationCSVRow> rows, ZoneId zoneId) {
    for (AttachCertificationCSVRow row : rows) {
      final Airman airman = airmanRepository.findOneByFirstNameAndLastName(
        row.getFirstName(),
        row.getLastName()
      );

      final Certification certification = certificationRepository.findOneByTitleAndSiteId(
        row.getCertificationName(),
        airman.getSiteId()
      );

      airman.addCertification(new AirmanCertification(
        certification,
        instantFromDateString(row.getEarnDate(), zoneId),
        instantFromDateString(row.getExpirationDate(), zoneId)
      ));

      airmanRepository.save(airman);
    }
  }

  private Instant instantFromDateString(String dateString, ZoneId zoneId) {
    LocalDate date = LocalDate.parse(dateString, FORMATTER);
    ZonedDateTime dateTime = ZonedDateTime.of(date.getYear(), date.getMonth().getValue(), date.getDayOfMonth(), 0, 0, 0, 0, zoneId);
    return Instant.from(dateTime);
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
