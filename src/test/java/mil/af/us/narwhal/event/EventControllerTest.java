package mil.af.us.narwhal.event;

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

import java.time.Instant;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

public class EventControllerTest extends BaseIntegrationTest {
  private Airman airman;
  @Autowired private SiteRepository siteRepository;
  @Autowired private AirmanRepository airmanRepository;
  @Autowired private EventRepository eventRepository;

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

  @After
  public void tearDown() {
    super.tearDown();
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