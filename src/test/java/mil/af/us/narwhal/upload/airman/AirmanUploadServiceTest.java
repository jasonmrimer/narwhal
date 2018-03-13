package mil.af.us.narwhal.upload.airman;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanCertification;
import mil.af.us.narwhal.airman.AirmanQualification;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.skills.Certification;
import mil.af.us.narwhal.skills.CertificationRepository;
import mil.af.us.narwhal.skills.Qualification;
import mil.af.us.narwhal.skills.QualificationRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.ZoneId;
import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@DataJpaTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class AirmanUploadServiceTest {
  private final Flight flight = new Flight("FLIGHT1");
  private final Squadron squadron = new Squadron("SQUAD1");
  private final Site site = new Site("SITE1");

  @Autowired private AirmanRepository airmanRepository;
  @Autowired private SiteRepository siteRepository;
  @Autowired private FlightRepository flightRepository;
  @Autowired private CertificationRepository certificationRepository;
  @Autowired private QualificationRepository qualificationRepository;
  private AirmanUploadService subject;

  @Before
  public void setUp() {
    squadron.addFlight(flight);
    site.addSquadron(squadron);
    siteRepository.save(site);

    subject = new AirmanUploadService(
      airmanRepository,
      siteRepository,
      flightRepository,
      certificationRepository,
      qualificationRepository
    );
  }

  @Test
  public void testImportToDatabase() throws Exception {
    final List<AirmanUploadCSVRow> rows = asList(
      new AirmanUploadCSVRow("first1", "last1", site.getName(), squadron.getName(), flight.getName()),
      new AirmanUploadCSVRow("first2", "last2", site.getName(), squadron.getName(), flight.getName()),
      new AirmanUploadCSVRow("first3", "last3", site.getName(), squadron.getName(), flight.getName())
    );

    subject.importToDatabase(rows);

    final List<Airman> airmen = airmanRepository.findAll();

    assertThat(airmen.stream().map(Airman::getFirstName).collect(toList()))
      .containsExactlyInAnyOrder("first1", "first2", "first3");

    assertThat(airmen.stream().map(Airman::getLastName).collect(toList()))
      .containsExactlyInAnyOrder("last1", "last2", "last3");

    assertThat(airmen.stream().map(Airman::flightId).distinct().findFirst().orElseThrow(Exception::new))
      .isEqualTo(flight.getId());
  }

  @Test
  public void testImportToDatabase_createsUnknownFlights() {
    final long count = flightRepository.count();

    subject.importToDatabase(singletonList(
      new AirmanUploadCSVRow("first1", "last1", site.getName(), squadron.getName(), "FLIGHT2")
    ));

    assertThat(flightRepository.count()).isEqualTo(count + 1);
  }

  @Test
  public void testImportToDatabase_doesNotDuplicateFlights_whenTheFlightAppearsTwice() {
    final long count = flightRepository.count();

    subject.importToDatabase(asList(
      new AirmanUploadCSVRow("first1", "last1", site.getName(), squadron.getName(), "NEW FLIGHT NAME"),
      new AirmanUploadCSVRow("first2", "last2", site.getName(), squadron.getName(), "NEW FLIGHT NAME")
    ));

    assertThat(flightRepository.count()).isEqualTo(count + 1);
  }

  @Test
  public void testImportToDatabase_doesNotCreateUnknownSites() {
    final long airmanCount = airmanRepository.count();
    final long flightCount = flightRepository.count();

    subject.importToDatabase(singletonList(
      new AirmanUploadCSVRow("first1", "last1", "unknown-site", "", "")
    ));

    assertThat(airmanRepository.count()).isEqualTo(airmanCount);
    assertThat(flightRepository.count()).isEqualTo(flightCount);
  }

  @Test
  public void testImportToDatabase_doesNotCreateUnknownSquadrons() {
    final long airmanCount = airmanRepository.count();
    final long flightCount = flightRepository.count();

    subject.importToDatabase(singletonList(
      new AirmanUploadCSVRow("first1", "last1", site.getName(), "unknown-squadron", "")
    ));

    assertThat(airmanRepository.count()).isEqualTo(airmanCount);
    assertThat(flightRepository.count()).isEqualTo(flightCount);
  }

  @Test
  public void testAttachAListOfCertifications() {
    final Airman airman = new Airman(flight, "first1", "last1");
    airmanRepository.save(airman);

    final Certification certification1 = new Certification("Certification1", site);
    final Certification certification2 = new Certification("Certification2", site);
    certificationRepository.save(asList(certification1, certification2));

    subject.attachCertifications(
      asList(
        new AttachCertificationCSVRow(
          airman.getFirstName(),
          airman.getLastName(),
          certification1.getTitle(),
          "03/22/2018",
          "05/22/2018"
        ),
        new AttachCertificationCSVRow(
          airman.getFirstName(),
          airman.getLastName(),
          certification2.getTitle(),
          "03/22/2018",
          "05/22/2018"
        )
      ),
      ZoneId.of("America/New_York")
    );

    final List<AirmanCertification> certifications = airmanRepository.findOne(airman.getId()).getCertifications();
    final List<Long> certificationIds = certifications.stream()
      .map(AirmanCertification::getCertification)
      .map(Certification::getId)
      .collect(toList());
    assertThat(certificationIds.size()).isEqualTo(2);
    assertThat(certificationIds).containsExactlyInAnyOrder(certification1.getId(), certification2.getId());
  }

  @Test
  public void testAttachAListOfQualifications() {
    final Airman airman = new Airman(flight, "first1", "last1");
    airmanRepository.save(airman);

    Qualification qualification1 = new Qualification("TEST", "test qualificaiton");
    qualificationRepository.save(qualification1);

    subject.attachQualifications(
      singletonList(
        new AttachQualificationCSVRow(
          airman.getFirstName(),
          airman.getLastName(),
          qualification1.getTitle(),
          "03/22/2018",
          "05/22/2018")
      ),
      ZoneId.of("America/New_York")
    );

    final List<AirmanQualification> qualifications = airman.getQualifications();

    final List<Long> qualificationIds = qualifications.stream()
      .map(AirmanQualification::getQualification)
      .map(Qualification::getId)
      .collect(toList());
    assertThat(qualificationIds.size()).isEqualTo(1);
    assertThat(qualificationIds).containsExactlyInAnyOrder(qualification1.getId());
  }
}