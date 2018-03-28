package mil.af.us.narwhal.upload.airman;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanCertification;
import mil.af.us.narwhal.airman.AirmanQualification;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.skill.Certification;
import mil.af.us.narwhal.skill.CertificationRepository;
import mil.af.us.narwhal.skill.Qualification;
import mil.af.us.narwhal.skill.QualificationRepository;
import mil.af.us.narwhal.squadron.Squadron;
import mil.af.us.narwhal.upload.ImportException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class AirmanUploadService {
  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MM/dd/yyyy");

  private AirmanRepository airmanRepository;
  private SiteRepository siteRepository;
  private FlightRepository flightRepository;
  private CertificationRepository certificationRepository;
  private QualificationRepository qualificationRepository;

  public AirmanUploadService(AirmanRepository airmanRepository, SiteRepository siteRepository, FlightRepository flightRepository, CertificationRepository certificationRepository, QualificationRepository qualificationRepository) {
    this.airmanRepository = airmanRepository;
    this.siteRepository = siteRepository;
    this.flightRepository = flightRepository;
    this.certificationRepository = certificationRepository;
    this.qualificationRepository = qualificationRepository;
  }

  @Transactional
  public void importToDatabase(List<AirmanUploadCSVRow> rows) throws ImportException {
    List<Integer> failedRows = new ArrayList<>();

    for (int i = 0; i < rows.size(); i++) {
      final AirmanUploadCSVRow row = rows.get(i);

      Site site = siteRepository.findOneByName(row.getSite());
      if (site == null) {
        failedRows.add(i + 1);
        continue;
      }

      Squadron squadron = getSquadron(row, site);
      if (squadron == null) {
        failedRows.add(i + 1);
        continue;
      }

      Flight flight = getFlight(row, squadron);

      final Airman airman = new Airman(flight, row.getFirstName(), row.getLastName());
      airmanRepository.save(airman);
    }

    if (failedRows.size() > 0) {
      throw new ImportException(failedRows);
    }
  }

  @Transactional
  public void attachCertifications(List<AttachCertificationCSVRow> rows, ZoneId zoneId) throws ImportException {
    Instant earnDate;
    Instant expirationDate;
    List<Integer> failedRows = new ArrayList<>();

    for (int i = 0; i < rows.size(); i++) {
      final AttachCertificationCSVRow row = rows.get(i);
      final Airman airman = airmanRepository.findOneByFirstNameAndLastName(
        row.getFirstName(),
        row.getLastName()
      );

      if (airman == null) {
        failedRows.add(i + 1);
        continue;
      }

      final Certification certification = certificationRepository.findOneByTitleAndSiteId(
        row.getCertificationName(),
        airman.getSiteId()
      );

      if (certification == null) {
        failedRows.add(i + 1);
        continue;
      }

      try {
        earnDate = instantFromDateString(row.getEarnDate(), zoneId);
        expirationDate = instantFromDateString(row.getExpirationDate(), zoneId);
      } catch (DateTimeParseException e) {
        failedRows.add(i + 1);
        continue;
      }

      airman.addCertification(new AirmanCertification(
        certification,
        earnDate,
        expirationDate
      ));

      airmanRepository.save(airman);
    }

    if (failedRows.size() > 0) {
      throw new ImportException(failedRows);
    }
  }

  @Transactional
  public void attachQualifications(List<AttachQualificationCSVRow> rows, ZoneId zoneId) {
    for (AttachQualificationCSVRow row : rows) {
      final Airman airman = airmanRepository.findOneByFirstNameAndLastName(
        row.getFirstName(),
        row.getLastName()
      );

      final Qualification qualification = qualificationRepository.findOneByTitle(row.getQualificationName());

      airman.addQualification(new AirmanQualification(
        qualification,
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
