package mil.af.us.narwhal.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.crew.Crew;
import mil.af.us.narwhal.crew.CrewPosition;
import mil.af.us.narwhal.crew.CrewRepository;
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
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;


@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class EventControllerTest {
  private final static ObjectMapper objectMapper = new ObjectMapper();
  private final static JavaTimeModule module = new JavaTimeModule();

  static {
    objectMapper.registerModule(module);
  }

  private Airman airman;
  @LocalServerPort private int port;
  @Autowired private SiteRepository siteRepository;
  @Autowired private AirmanRepository airmanRepository;
  @Autowired private EventRepository eventRepository;
  @Autowired private MissionRepository missionRepository;
  @Autowired private CrewRepository crewRepository;

  @Before
  public void setUp() {
    final Flight flight = new Flight("flight");

    final Squadron squadron = new Squadron("squadron");
    squadron.addFlight(flight);

    final Site site = new Site("site");
    site.addSquadron(squadron);
    siteRepository.save(site);

    airman = new Airman(flight, "first", "last");
    airman = airmanRepository.save(airman);
  }

  @Test
  public void createTest() throws Exception {
    final Event event = new Event(
      "New Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.APPOINTMENT,
      airman.getId()
    );
    final String json = objectMapper.writeValueAsString(event);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .post(EventController.URI)
    .then()
      .statusCode(200)
      .body("id", notNullValue());
    // @formatter:on
  }

  @Test
  public void createWithBlankFieldsTest() throws Exception {
    final Event event = new Event(
      "",
      "",
      null,
      null,
      EventType.APPOINTMENT,
      airman.getId()
    );

    final String json = objectMapper.writeValueAsString(event);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .post(EventController.URI)
    .then()
      .statusCode(400)
      .body("errors[0].defaultMessage", equalTo("This field is required."));
    // @formatter:on
  }

  @Test
  public void createWithInvalidEndDateTest() throws Exception {
    Instant now = Instant.now();
    final Event event = new Event(
      "New Event",
      "New Description",
      now,
      now.minusSeconds(100),
      EventType.APPOINTMENT,
      airman.getId()
    );

    final String json = objectMapper.writeValueAsString(event);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .post(EventController.URI)
    .then()
      .statusCode(400)
      .body("errors[0].defaultMessage", equalTo("End Date cannot be before Start Date."));
    // @formatter:on
  }

  @Test
  public void updateTest() throws Exception {
    Event existingEvent = new Event(
      "Existing Event",
      "Existing Description",
      Instant.now(),
      Instant.now(),
      EventType.APPOINTMENT,
      airman.getId()
    );
    existingEvent = eventRepository.save(existingEvent);
    final String json = objectMapper.writeValueAsString(existingEvent);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .put(EventController.URI + "/" + existingEvent.getId())
    .then()
      .statusCode(200)
      .body("id", equalTo(existingEvent.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void deleteTest() {
    Event event = new Event(
      "Existing Event",
      "Existing Description",
      Instant.now(),
      Instant.now(),
      EventType.APPOINTMENT,
      airman.getId()
    );
    event = eventRepository.save(event);


    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
    .when()
      .delete(EventController.URI + "/" + event.getId())
    .then()
      .statusCode(200);
    // @formatter:on

    assertThat(eventRepository.findOne(event.getId())).isNull();
  }
}