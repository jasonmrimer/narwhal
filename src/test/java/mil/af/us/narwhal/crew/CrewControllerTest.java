package mil.af.us.narwhal.crew;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.Instant;

import static io.restassured.RestAssured.given;
import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.equalTo;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class CrewControllerTest {
  private final static ObjectMapper objectMapper = new ObjectMapper();
  private final static JavaTimeModule module = new JavaTimeModule();

  static {
    objectMapper.registerModule(module);
  }

  private Site site;
  private Mission mission;
  private Airman airman;
  private Crew crew;
  @LocalServerPort private int port;
  @Autowired private CrewRepository crewRepository;
  @Autowired private SiteRepository siteRepository;
  @Autowired private MissionRepository missionRepository;
  @Autowired private AirmanRepository airmanRepository;
  private Flight flight;

  @Before
  public void setUp() {
    flight = new Flight();

    Squadron squadron = new Squadron();
    squadron.addFlight(flight);

    site = new Site();
    site.addSquadron(squadron);
    siteRepository.save(site);

    mission = new Mission("A", "B", Instant.now(), Instant.now(), site);
    missionRepository.save(mission);

    airman = new Airman(flight, "A", "B");
    airmanRepository.save(airman);

    crew = new Crew(mission);
    crew.addCrewPosition(new CrewPosition(crew, airman));
    crewRepository.save(crew);
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
      .get(CrewController.URI + "/" + crew.getId())
    .then()
      .statusCode(200)
      .body("mission.missionId", equalTo(mission.getMissionId()))
      .body("crewPositions.size()", equalTo(1))
      .body("crewPositions[0].airman.id", equalTo(airman.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void addAirmanTest() throws JsonProcessingException {
    final Airman newAirman = new Airman(flight, "B", "C");
    airmanRepository.save(newAirman);

    final String json = objectMapper.writeValueAsString(singletonList(
      new CrewPositionJSON(null, "", false, newAirman.getId())
    ));

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .put(CrewController.URI + "/" + crew.getId() + "/positions")
    .then()
      .statusCode(200)
      .body("crewPositions.size()", equalTo(2))
      .body("crewPositions[1].airman.id", equalTo(newAirman.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void updateTest() throws JsonProcessingException {
    final CrewPosition crewPosition = crew.getCrewPositions().get(0);
    final String json = objectMapper.writeValueAsString(singletonList(
      new CrewPositionJSON(
        crewPosition.getId(),
        "GOOBER",
        true,
        crewPosition.getAirman().getId())
    ));

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .put(CrewController.URI + "/" + crew.getId() + "/positions")
    .then()
      .statusCode(200)
      .body("crewPositions[0].title", equalTo("GOOBER"))
      .body("crewPositions[0].critical", equalTo(true));
   // @formatter:on
  }
}