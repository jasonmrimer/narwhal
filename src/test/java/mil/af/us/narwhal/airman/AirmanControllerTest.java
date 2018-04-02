package mil.af.us.narwhal.airman;

import com.fasterxml.jackson.core.JsonProcessingException;
import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.flight.Flight;
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

import java.time.Instant;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;

public class AirmanControllerTest extends BaseIntegrationTest {
  private Airman airman1;
  private Squadron squadron2;
  private Flight flight1;
  private Qualification qualification1;
  private Certification certification1;
  @Autowired private SiteRepository siteRepository;
  @Autowired private AirmanRepository airmanRepository;
  @Autowired private QualificationRepository qualificationRepository;
  @Autowired private CertificationRepository certificationRepository;

  @Before
  public void setUp() {
    flight1 = new Flight("flight1");
    Squadron squadron1 = new Squadron("squadron1");
    squadron1.addFlight(flight1);

    final Flight flight2 = new Flight("flight2");
    squadron2 = new Squadron("squadron2");
    squadron2.addFlight(flight2);

    final Site site = new Site("site");
    site.addSquadron(squadron1);
    site.addSquadron(squadron2);

    siteRepository.save(site);

    airman1 = new Airman(flight1, "first1", "last1");
    airman1.setShift(ShiftType.Day);
    final Airman airman2 = new Airman(flight2, "first2", "last2");
    final Airman airman3 = new Airman(flight2, "first3", "last3");

    airmanRepository.save(asList(airman1, airman2, airman3));

    qualification1 = new Qualification("Q1", "qualification1");
    qualificationRepository.save(qualification1);

    certification1 = new Certification("certification1", site);
    certificationRepository.save(certification1);
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void indexTest() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(AirmanController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(3))
      .body("[0].firstName", equalTo("first1"))
      .body("[0].shift", equalTo("Day"))
      .body("[1].shift", equalTo(null));
    // @formatter:on
  }

  @Test
  public void createAirmanQualificationTest() throws JsonProcessingException {
    final String json = objectMapper.writeValueAsString(
      new AirmanSkillJSON(qualification1.getId(), Instant.now(), Instant.now())
    );

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .body(json)
      .contentType("application/json")
    .when()
      .post(AirmanController.URI + "/" + airman1.getId() + "/qualifications")
    .then()
      .statusCode(201)
      .body("qualifications[0].qualification.id", equalTo(qualification1.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void createAirmanCertification() throws JsonProcessingException {
    final String json = objectMapper.writeValueAsString(
      new AirmanSkillJSON(
        certification1.getId(), Instant.now(), Instant.now())
    );

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .body(json)
      .contentType("application/json")
    .when()
      .post(AirmanController.URI + "/" + airman1.getId() + "/certifications")
    .then()
      .statusCode(201)
      .body("certifications[0].certification.id", equalTo(certification1.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void updateTest() throws JsonProcessingException {
    airman1.setShift(ShiftType.Night);
    final String json = objectMapper.writeValueAsString(airman1);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .post(AirmanController.URI)
    .then()
      .statusCode(200)
      .body("shift", equalTo("Night"));
    // @formatter:on
  }

  @Test
  public void updateAirmanQualification() throws JsonProcessingException {
    final AirmanQualification airmanQualification = new AirmanQualification(
      qualification1,
      Instant.now(),
      Instant.now()
    );
    airman1.addQualification(airmanQualification);
    Airman savedAirman1 = airmanRepository.save(airman1);

    final AirmanQualification updatedAirmanQualification = savedAirman1.getQualifications().get(0);
    final String json = objectMapper.writeValueAsString(
      new AirmanSkillJSON(
        updatedAirmanQualification.getId(),
        updatedAirmanQualification.getQualification().getId(),
        updatedAirmanQualification.getEarnDate(),
        Instant.EPOCH
      )
    );

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .body(json)
      .contentType("application/json")
    .when()
      .put(AirmanController.URI + "/" + airman1.getId() + "/qualifications")
    .then()
      .statusCode(200)
      .body("qualifications[0].expirationDate", equalTo("1970-01-01T00:00:00Z"));
    // @formatter:on
  }

  @Test
  public void updateAirmanCertification() throws JsonProcessingException {
    final AirmanCertification airmanCertification = new AirmanCertification(
      certification1,
      Instant.now(),
      Instant.now()
    );
    airman1.addCertification(airmanCertification);
    final Airman savedAirman1 = airmanRepository.save(airman1);

    final AirmanCertification updatedAirmanCertification = savedAirman1.getCertifications().get(0);
    final String json = objectMapper.writeValueAsString(
      new AirmanSkillJSON(
        updatedAirmanCertification.getId(),
        updatedAirmanCertification.getCertification().getId(),
        updatedAirmanCertification.getEarnDate(),
        Instant.EPOCH
      )
    );

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .body(json)
      .contentType("application/json")
    .when()
      .put(AirmanController.URI + "/" + airman1.getId() + "/certifications")
    .then()
      .statusCode(200)
      .body("certifications[0].expirationDate", equalTo("1970-01-01T00:00:00Z"));
    // @formatter:on
  }

  @Test
  public void deleteQualificationTest() {
    final AirmanQualification airmanQualification = new AirmanQualification(
      qualification1,
      Instant.now(),
      Instant.now()
    );
    airman1.addQualification(airmanQualification);
    final Long airmanQualificationId = airmanRepository.save(airman1).getQualifications().get(0).getId();

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .delete(AirmanController.URI + "/" + airman1.getId() + "/qualifications/" + airmanQualificationId)
    .then()
      .statusCode(200)
      .body("qualifications.size()", equalTo(0));
    // @formatter:on
  }

  @Test
  public void deleteCertificationTest() {
    final AirmanCertification airmanCertification = new AirmanCertification(
      certification1,
      Instant.now(),
      Instant.now()
    );
    airman1.addCertification(airmanCertification);
    final Long airmanCertificationId = airmanRepository.save(airman1).getCertifications().get(0).getId();

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .delete(AirmanController.URI + "/" + airman1.getId() + "/certifications/" + airmanCertificationId)
    .then()
      .statusCode(200)
      .body("certifications.size()", equalTo(0));
    // @formatter:on
  }
}