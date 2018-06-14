package mil.af.us.narwhal.flight;

import com.fasterxml.jackson.core.JsonProcessingException;
import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.AirmanController;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

public class FlightControllerTest extends BaseIntegrationTest {
  @Autowired private SiteRepository siteRepository;
  @Autowired private FlightRepository flightRepository;

  private Squadron squadron;
  private Site site;
  private Flight flight;

  @Before
  public void setUp() {
    super.setUp();
    squadron = new Squadron("squadron");
    site = new Site("site");
    site.addSquadron(squadron);
    flight = new Flight(squadron, "flight");
    squadron.addFlight(flight);
    siteRepository.save(asList(site));
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void createTest() throws JsonProcessingException {
    FlightJSON flightJSON = new FlightJSON();
    flightJSON.setName("flightName");
    flightJSON.setSquadronId(squadron.getId());
    final String json = objectMapper.writeValueAsString(flightJSON);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .post(FlightController.URI)
    .then()
      .statusCode(201)
      .body("id", notNullValue())
      .body("name", equalTo("flightName"))
      .body("squadronId", equalTo(squadron.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void deleteTest() throws JsonProcessingException {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .when()
      .delete(FlightController.URI + "/" + flight.getId())
      .then()
      .statusCode(200);
    // @formatter:on
  }
}
