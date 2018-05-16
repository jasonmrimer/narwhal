package mil.af.us.narwhal.skill;

import com.fasterxml.jackson.core.JsonProcessingException;
import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class CertificationControllerTest extends BaseIntegrationTest {
  private Certification certification;
  @Autowired CertificationRepository certificationRepository;

  @Before
  public void setUp() {
    super.setUp();
    flight = new Flight("flight");

    final Squadron squadron = new Squadron("squadron");
    squadron.addFlight(flight);

    site = new Site("site");
    site.addSquadron(squadron);
    siteRepository.save(site);

    final Flight flight2 = new Flight("flight2");

    final Squadron squadron2 = new Squadron("squadron2");
    squadron.addFlight(flight2);

    final Site site2 = new Site("site2");
    site2.addSquadron(squadron2);
    siteRepository.save(site2);

    certification = new Certification("Cert", site);
    final Certification cert2 = new Certification("Cert", site2);

    certificationRepository.save(certification);
    certificationRepository.save(cert2);
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void testIndex() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(CertificationController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(2));
    // @formatter:on
  }

  @Test
  public void testIndexWithSiteId() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(CertificationController.URI + "?siteId=" + site.getId())
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(1));
    // @formatter:on
  }

  @Test
  public void testShow() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(CertificationController.URI + "/" + certification.getId())
    .then()
      .statusCode(200)
      .body("title", equalTo("Cert"));
    // @formatter:on
  }

  @Test
  public void testUpdate() throws JsonProcessingException {
    certification.setTitle("COREY'S CERT");
    final String json = objectMapper.writeValueAsString(certification);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .put(CertificationController.URI + "/" + certification.getId())
    .then()
      .statusCode(200)
      .body("title", equalTo("COREY'S CERT"));
    // @formatter:on
  }
}