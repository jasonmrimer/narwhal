package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.BaseIntegrationTest;
import com.fasterxml.jackson.core.JsonProcessingException;
import mil.af.us.narwhal.event.EventController;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.squadron.Squadron;
import mil.af.us.narwhal.squadron.SquadronRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.assertj.core.api.Assertions.assertThat;

public class AdminSquadronControllerTest extends BaseIntegrationTest {
  @Autowired private FlightRepository flightRepository;
  @Autowired private SquadronRepository squadronRepository;

  @Before
  public void setUp() {
    super.setUp();
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
      .get(AdminSquadronController.URI)
      .then()
      .statusCode(200)
      .body("$.size()", equalTo(2))
      .body("[0].siteId", greaterThan(0))
      .body("[0].siteName", equalTo("site"))
      .body("[0].squadronId", greaterThan(0))
      .body("[0].squadronName", equalTo("squadron"))
      .body("[1].siteId", greaterThan(0))
      .body("[1].siteName", equalTo("site"))
      .body("[1].squadronId", greaterThan(0))
      .body("[1].squadronName", equalTo("squadron2"));
    //    // @formatter:on
  }

  @Test
  public void createSquadronTest() throws JsonProcessingException {
    final String json = objectMapper.writeValueAsString(
      new AdminSquadronItemJSON(site.getId(), site.getName(), null, "OurNewSquadron", 0l)
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
      .post(AdminSquadronController.URI)
      .then()
      .statusCode(201)
      .body("squadronId", greaterThan(2));
    // @formatter:on
  }

  @Test
  public void deleteSquadronTest() {
    Squadron item = new Squadron();
    item.setName("DeleteSquad");
    final Flight flightToDelete = new Flight();
    flight.setName("DeleteFlight");
    item.addFlight(flightToDelete);

    item = squadronRepository.save(item);
    System.out.println("marker 1");
    System.out.println(item.getId());
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .when()
      .delete(AdminSquadronController.URI + "/" + item.getId())
      .then()
      .statusCode(200);
    // @formatter:on

    assertThat(squadronRepository.findOne(item.getId())).isNull();
  }
}
