package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.event.EventJSON;
import mil.af.us.narwhal.event.EventType;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.profile.Profile;
import mil.af.us.narwhal.profile.ProfileRepository;
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
  private Mission mission;
  private Airman airman;
  private Airman airman2;
  @Autowired private CrewPositionRepository crewPositionRepository;
  @Autowired private SiteRepository siteRepository;
  @Autowired private MissionRepository missionRepository;
  @Autowired private AirmanRepository airmanRepository;
  @Autowired private ProfileRepository profileRepository;

  @Before
  public void setUp() {
    super.setUp();

    Flight flight = new Flight();

    Squadron squadron = new Squadron();
    squadron.addFlight(flight);

    Site site = new Site();
    site.addSquadron(squadron);
    siteRepository.save(site);

    airman = airmanRepository.save(new Airman(flight, "A", "B", rank));
    airman2 = airmanRepository.save(new Airman(flight, "B", "C", rank));

    mission = new Mission("A", "B", Instant.now(), Instant.now(), "U-2", site, Instant.now());
    mission.addCrewPosition(new CrewPosition(airman));

    mission = missionRepository.save(mission);

    profileRepository.save(singletonList(new Profile("tytus", site, adminRole, "password")));
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
  public void createTest() {
    final EventJSON json = new EventJSON(
      mission.getId(),
      "New Mission Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.MISSION,
      airman2.getId()
    );

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .put(CrewController.URI)
    .then()
      .statusCode(200)
      .body("id", equalTo(json.getId().intValue()));
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