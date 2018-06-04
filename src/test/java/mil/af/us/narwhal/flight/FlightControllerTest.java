package mil.af.us.narwhal.flight;

import com.fasterxml.jackson.core.JsonProcessingException;
import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.AirmanController;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;

public class FlightControllerTest extends BaseIntegrationTest {
  @Autowired private SiteRepository siteRepository;
  @Autowired private FlightRepository flightRepository;

//  private Flight flight;
  private Squadron squadron;
  private Site site;

  @Before
  public void setUp() {
    super.setUp();
//    flight = new Flight("flight");
    squadron = new Squadron("squadron");
//    squadron.addFlight(flight);
    site = new Site("site");
    site.addSquadron(squadron);
    siteRepository.save(asList(site));
//    System.out.println(flight.getId());
  }

  @Test
  public void createTest() throws JsonProcessingException {
    Flight flight = new Flight(squadron, "flightName");
    final String json = objectMapper.writeValueAsString(flight);
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
      .body("name", equalTo("flightName"))

      .body("squadron", equalTo(squadron.getId()));
    // @formatter:on
  }
}
