package mil.af.us.narwhal.crew;

import com.fasterxml.jackson.core.JsonProcessingException;
import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;

import static io.restassured.RestAssured.given;
import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class CrewControllerTest extends BaseIntegrationTest {
  private Site site;
  private Flight flight;
  private Mission mission;
  private Airman airman;
  @Autowired private CrewPositionRepository crewPositionRepository;
  @Autowired private SiteRepository siteRepository;
  @Autowired private MissionRepository missionRepository;
  @Autowired private AirmanRepository airmanRepository;

  @Before
  public void setUp() {
    flight = new Flight();

    Squadron squadron = new Squadron();
    squadron.addFlight(flight);

    site = new Site();
    site.addSquadron(squadron);
    siteRepository.save(site);

    airman = new Airman(flight, "A", "B");
    airmanRepository.save(airman);

    mission = new Mission("A", "B", Instant.now(), Instant.now(), "U-2", site);
    mission.addCrewPosition(new CrewPosition(airman));
    missionRepository.save(mission);
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void showTest() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(CrewController.URI + "/" + mission.getId())
    .then()
      .statusCode(200)
      .body("id", equalTo(mission.getId().intValue()))
      .body("crewPositions.size()", equalTo(1))
      .body("crewPositions[0].airman.id", equalTo(airman.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void deleteTest() {
    long count = crewPositionRepository.count();

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
    .when()
      .delete(CrewController.URI + "/" + mission.getId() + "/airmen/" + airman.getId())
    .then()
      .statusCode(200);
   // @formatter:on

    assertThat(crewPositionRepository.count()).isEqualTo(count - 1);
  }
}