package mil.af.us.narwhal.crew;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
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
import java.util.List;

import static io.restassured.RestAssured.given;
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

  @Before
  public void setUp() {
    site = new Site();
    siteRepository.save(site);

    mission = new Mission("A", "B", Instant.now(), Instant.now(), site);
    missionRepository.save(mission);

    airman = new Airman(1L, "A", "B");
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
  public void updateTest() throws JsonProcessingException {
    final List<CrewPosition> positions = crew.getCrewPositions();
    positions.get(0).setTitle("GOOBER");
    positions.get(0).setCritical(true);

    final String json = objectMapper.writeValueAsString(positions);

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