package mil.af.us.narwhal.crew;

import com.fasterxml.jackson.core.JsonProcessingException;
import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static io.restassured.RestAssured.given;
import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;


public class CrewPositionControllerTest extends BaseIntegrationTest {
  @Autowired SiteRepository siteRepository;
  @Autowired AirmanRepository airmanRepository;

  @Before
  public void setup() {
    super.setUp();

    super.buildAirman();
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void createTest() throws JsonProcessingException {
    Airman airman = new Airman(flight, "FirstTwo", "LastTwo");
    airmanRepository.save(airman);

    CrewPosition crewPosition = new CrewPosition(airman);

    CrewPositionJSON crewPositionJSON = new CrewPositionJSON();
    crewPositionJSON.setAirmanId(crewPosition.getAirman().getId());

    String json = objectMapper.writeValueAsString(singletonList(crewPositionJSON));

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .put(CrewPositionController.URI + "/" + mission.getId())
    .then()
      .statusCode(200)
      .body("id", notNullValue());
    // @formatter:on
  }

  @Test
  public void updateTest() throws JsonProcessingException {
    CrewPosition crewPosition = crewPositionRepository.findAll().get(0);
    crewPosition.setCritical(true);
    crewPosition.setTitle("UPDATED CREW POSITION");
    CrewPositionJSON crewPositionJSON = new CrewPositionJSON(crewPosition.getId(), crewPosition.getTitle(), crewPosition.getCritical(), crewPosition.getAirman().getId());
    String json = objectMapper.writeValueAsString(singletonList(crewPositionJSON));

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .put(CrewPositionController.URI + "/" + mission.getId())
    .then()
      .statusCode(200)
      .body("[0].title", equalTo("UPDATED CREW POSITION"));
    // @formatter:on
  }

  @Test
  public void deleteTest() throws JsonProcessingException {
    CrewPosition crewPosition = crewPositionRepository.findAll().get(0);
    CrewPositionJSON crewPositionJSON = new CrewPositionJSON(crewPosition.getId(), crewPosition.getTitle(), crewPosition.getCritical(), crewPosition.getAirman().getId());
    String json = objectMapper.writeValueAsString(singletonList(crewPositionJSON));

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .delete(CrewPositionController.URI + "/")
    .then()
      .statusCode(200);
    // @formatter:on

    List<CrewPosition> crewPositions = crewPositionRepository.findAll();
    assertThat(crewPositions.size(), equalTo(0));
  }
}
