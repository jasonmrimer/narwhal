package mil.af.us.narwhal.upload;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.rank.Rank;
import mil.af.us.narwhal.rank.RankRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.skill.Certification;
import mil.af.us.narwhal.skill.CertificationRepository;
import mil.af.us.narwhal.skill.Qualification;
import mil.af.us.narwhal.skill.QualificationRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

public class UploadControllerTest extends BaseIntegrationTest {
  @Autowired private SiteRepository siteRepository;
  @Autowired private AirmanRepository airmanRepository;
  @Autowired private CertificationRepository certificationRepository;
  @Autowired private QualificationRepository qualificationRepository;
  @Autowired private RankRepository rankRepository;
  public Airman airman;

  @Before
  public void setUp() {
    super.setUp();

    final Flight flight = new Flight("FLIGHT");

    final Squadron squad = new Squadron("SQUADRON");
    squad.addFlight(flight);

    final Site site = new Site("SITE");
    site.addSquadron(squad);

    siteRepository.save(site);

    certificationRepository.save(new Certification("TITLE", site));
    qualificationRepository.save(new Qualification("ACR", "TITLE"));


    airman = airmanRepository.save(new Airman(flight, "FIRST", "LAST", rank));
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void testImportAirmanCSV() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("lastName,firstName,site,squadron,flight\nLast,First,SITE,SQUADRON,FLIGHT".getBytes());
    }

    final long count = airmanRepository.count();

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen")
    .then()
      .statusCode(201);
    // @formatter:on

    assertThat(airmanRepository.count()).isEqualTo(count + 1);
  }

  @Test
  public void testImportAirmanCSV_handlesNullSite() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("lastName,firstName,site,squadron,flight\nLast,First,SITE?,SQUADRON,FLIGHT".getBytes());
    }

    final long count = airmanRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "Row(s) 1 contain errors.\n" +
      "Check that your sites and squadrons are identical to the ones on the tracker filters, eg. sites are formatted as DMS-TX and squadrons as 3 IS.");
    assertThat(airmanRepository.count()).isEqualTo(count);
  }

  @Test
  public void testImportAirmanCSV_handlesNullSquadrons() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("lastName,firstName,site,squadron,flight\nLast,First,SITE,SQUADRON?,FLIGHT".getBytes());
    }

    final long count = airmanRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "Row(s) 1 contain errors.\n" +
      "Check that your sites and squadrons are identical to the ones on the tracker filters, eg. sites are formatted as DMS-TX and squadrons as 3 IS.");
    assertThat(airmanRepository.count()).isEqualTo(count);
  }

  @Test
  public void testImportAirmanCSV_handlesBadHeaders() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("lastName?,firstName?,site?,squadron?,flight?\nLast,First,SITE,SQUADRON,FLIGHT".getBytes());
    }

    final long count = airmanRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful. Header is missing required fields [SITE,FLIGHT,LASTNAME,FIRSTNAME,SQUADRON]");
    assertThat(airmanRepository.count()).isEqualTo(count);
  }

  @Test
  public void testImportCertificationCSV_handlesNullSite() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("title,site\nTitle,SITE?".getBytes());
    }

    final long count = certificationRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/certifications")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "Row(s) 1 contain errors.\n" +
      "Check that your sites are identical to the ones on the tracker filters, eg. sites are formatted as DMS-TX.");
    assertThat(certificationRepository.count()).isEqualTo(count);
  }

  @Test
  public void testImportCertificationCSV_handlesBadHeaders() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("title?,site?\nTitle,SITE".getBytes());
    }

    final long count = certificationRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/certifications")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful. Header is missing required fields [SITE,TITLE]");
    assertThat(certificationRepository.count()).isEqualTo(count);
  }

  @Test
  public void testImportCertificationCSV_handlesBadRows() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("title,site\nTitle".getBytes());
    }

    final long count = certificationRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/certifications")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "The following required fields were not present for one record of the input: site at line 1.");
    assertThat(certificationRepository.count()).isEqualTo(count);
  }

  @Test
  public void testAttachCertificationsCSV_handlesNullValues() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write(("firstName,lastName,certificationName,earnDate,expirationDate\n" +
        "FIRST?,LAST,TITLE,09/22/2018,09/22/2019\n" +
        "FIRST,LAST?,TITLE,09/22/2018,09/22/2019\n" +
        "FIRST,LAST,TITLE?,09/22/2018,09/22/2019\n" +
        "FIRST,LAST,TITLE,09/22/2018?,09/22/2019\n" +
        "FIRST,LAST,TITLE,09/22/2018,09/22/2019?").getBytes());
    }

    final int count = airmanRepository.findOne(airman.getId()).getCertifications().size();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("timezone", "America/New_York")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen/certifications")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "Row(s) 1, 2, 3, 4, 5 contain errors.\n" +
      "Check that your date is formatted as mm/dd/yyyy.\n" +
      "Check that the certificates have already been uploaded and spelled correctly. \n" +
      "Check that all airmen have already been uploaded.");
    assertThat(airmanRepository.findOne(airman.getId()).getCertifications().size()).isEqualTo(count);
  }

  @Test
  public void testAttachCertificationsCSV_handlesBadHeaders() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write(("firstName?,lastName?,certificationName?,earnDate?,expirationDate?\n" +
        "FIRST,LAST,TITLE,09/22/2018,09/22/2019").getBytes());
    }

    final long count = certificationRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("timezone", "America/New_York")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen/certifications")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful. Header is missing required fields [LASTNAME,EARNDATE,CERTIFICATIONNAME,FIRSTNAME,EXPIRATIONDATE]");
    assertThat(certificationRepository.count()).isEqualTo(count);
  }

  @Test
  public void testAttachCertificationsCSV_handlesBadRows() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write(("firstName,lastName,certificationName,earnDate,expirationDate\n" +
        "FIRST,LAST,TITLE,09/22/2018").getBytes());
    }

    final long count = certificationRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("timezone", "America/New_York")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen/certifications")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "The following required fields were not present for one record of the input: " +
      "expirationDate at line 1.");
    assertThat(certificationRepository.count()).isEqualTo(count);
  }

  @Test
  public void testAttachQualificationsCSV_handlesNullValues() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write(("firstName,lastName,qualificationName,earnDate,expirationDate\n" +
        "FIRST?,LAST,TITLE,09/22/2018,09/22/2019\n" +
        "FIRST,LAST?,TITLE,09/22/2018,09/22/2019\n" +
        "FIRST,LAST,TITLE?,09/22/2018,09/22/2019\n" +
        "FIRST,LAST,TITLE,09/22/2018?,09/22/2019\n" +
        "FIRST,LAST,TITLE,09/22/2018,09/22/2019?").getBytes());
    }

    final int count = airmanRepository.findOne(airman.getId()).getQualifications().size();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("timezone", "America/New_York")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen/qualifications")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "Row(s) 1, 2, 3, 4, 5 contain errors.\n" +
      "Check that your date is formatted as mm/dd/yyyy.\n" +
      "Check that the qualifications have already been uploaded and spelled correctly. \n" +
      "Check that all airmen have already been uploaded.");
    assertThat(airmanRepository.findOne(airman.getId()).getQualifications().size()).isEqualTo(count);
  }

  @Test
  public void testAttachQualificationsCSV_handlesBadHeaders() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write(("firstName?,lastName?,qualificationName?,earnDate?,expirationDate?\n" +
        "FIRST,LAST,TITLE,09/22/2018,09/22/2019").getBytes());
    }

    final long count = qualificationRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("timezone", "America/New_York")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen/qualifications")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful. Header is missing required fields [LASTNAME,EARNDATE,QUALIFICATIONNAME,FIRSTNAME,EXPIRATIONDATE]");
    assertThat(qualificationRepository.count()).isEqualTo(count);
  }

  @Test
  public void testAttachQualificationsCSV_handlesBadRows() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write(("firstName,lastName,qualificationName,earnDate,expirationDate\n" +
        "FIRST,LAST,TITLE,09/22/2018").getBytes());
    }

    final long count = qualificationRepository.count();

    // @formatter:off
    final String message = given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("timezone", "America/New_York")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airmen/qualifications")
    .then()
      .statusCode(400)
      .extract()
      .body()
      .asString();
    // @formatter:on

    assertThat(message).isEqualTo("Upload was unsuccessful.\n" +
      "The following required fields were not present for one record of the input: " +
      "expirationDate at line 1.");
    assertThat(qualificationRepository.count()).isEqualTo(count);
  }
}