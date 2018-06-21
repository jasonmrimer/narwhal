package mil.af.us.narwhal.event;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.crew.CrewPosition;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.rank.Rank;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;

public class EventControllerTest extends BaseIntegrationTest {
  private Airman airman;
  private Airman airman2;
  private Airman airman3;
  @Autowired private SiteRepository siteRepository;
  @Autowired private AirmanRepository airmanRepository;
  @Autowired private EventRepository eventRepository;
  @Autowired private MissionRepository missionRepository;

  @Before
  public void setUp() {
    super.setUp();

    final Flight flight2 = new Flight("flight2");

    final Squadron squadron2 = new Squadron("squadron2");
    squadron2.addFlight(flight2);

    final Site site2 = new Site("site2");
    site2.addSquadron(squadron2);
    siteRepository.save(site2);

    airman = airmanRepository.save(new Airman(flight, "first", "last", rank));
    airman2 = airmanRepository.save(new Airman(flight, "first2", "last2", rank));
    airman3 = airmanRepository.save(new Airman(flight2, "first3", "last3", rank));
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
      EventStatus.APPROVED,
      airman
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
      .body("id", notNullValue())
      .body("createdBy", notNullValue())
      .body("createdOn", notNullValue());
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
      EventStatus.APPROVED,
      airman
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
      EventStatus.APPROVED,
      airman
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
      EventStatus.APPROVED,
      airman
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
      EventStatus.APPROVED,
      airman
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


  @Test
  public void findAllBySiteIdAndWithinPeriod() {
    Instant start = Instant.parse("2018-04-02T10:30:00.00Z");
    final Event event1 = new Event(
      "New Event",
      "New Description",
      start,
      start,
      EventType.APPOINTMENT,
      EventStatus.APPROVED,
      airman
    );
    final Event event2 = new Event(
      "New Event",
      "New Description",
      start.minus(30, ChronoUnit.DAYS),
      start.minus(30, ChronoUnit.DAYS),
      EventType.APPOINTMENT,
      EventStatus.APPROVED,
      airman
    );
    final Event event3 = new Event(
      "New Event",
      "New Description",
      start,
      start,
      EventType.APPOINTMENT,
      EventStatus.APPROVED,
      airman3
    );
    eventRepository.save(asList(event1, event2, event3));

    Mission mission = new Mission("A", "B", start, start, "U-2", site, Instant.now());
    mission.addCrewPosition(new CrewPosition(airman));
    missionRepository.save(mission);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("siteId", site.getId())
      .queryParam("start", "2018-04-02T10:30:00.00Z")
      .queryParam("end", "2018-04-09T10:30:00.00Z")
    .when()
      .get(EventController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(2))
      .body("id", hasItems(event1.getId().intValue(), mission.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void findAllByAirmanIdAndWithinPeriod() {
    Instant start = Instant.parse("2018-04-02T10:30:00.00Z");
    final Event event1 = new Event(
      "New Event",
      "New Description",
      start,
      start,
      EventType.APPOINTMENT,
      EventStatus.APPROVED,
      airman2
    );

    final Event event2 = new Event(
      "New Event",
      "New Description",
      start.minus(30, ChronoUnit.DAYS),
      start.minus(30, ChronoUnit.DAYS),
      EventType.APPOINTMENT,
      EventStatus.PENDING,
      airman
    );
    eventRepository.save(asList(event1, event2));

    Mission mission = new Mission("A", "B", start, start, "U-2", site, Instant.now());
    mission.addCrewPosition(new CrewPosition(airman));
    missionRepository.save(mission);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("airmanId", airman2.getId())
      .queryParam("start", "2018-04-02T10:30:00.00Z")
      .queryParam("end", "2018-04-09T10:30:00.00Z")
    .when()
      .get(EventController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(1))
      .body("id", hasItem(event1.getId().intValue()))
      .body("status", hasItem(event1.getStatus().toString()));
    // @formatter:on
  }

  @Test
  public void pendingCount() {
    Instant start = Instant.now();
    final Event event1 = new Event(
      "New Event",
      "New Description",
      start,
      start,
      EventType.APPOINTMENT,
      EventStatus.PENDING,
      airman3
    );

    final Event event2 = new Event(
      "New Event",
      "New Description",
      start.plus(30, ChronoUnit.DAYS),
      start.plus(30, ChronoUnit.DAYS),
      EventType.APPOINTMENT,
      EventStatus.PENDING,
      airman
    );
    eventRepository.save(asList(event1, event2));

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .when()
      .get(EventController.URI + "/hasPending")
      .then()
      .statusCode(200)
      .body("success", equalTo(true));
    // @formatter:on
  }

  @Test
  public void pending() {
    Instant start = Instant.now();
    final Event event1 = new Event(
      "New Event",
      "New Description",
      start,
      start,
      EventType.APPOINTMENT,
      EventStatus.PENDING,
      airman3
    );

    final Event event2 = new Event(
      "New Event",
      "New Description",
      start.plus(30, ChronoUnit.DAYS),
      start.plus(30, ChronoUnit.DAYS),
      EventType.APPOINTMENT,
      EventStatus.PENDING,
      airman
    );
    eventRepository.save(asList(event1, event2));

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .when()
      .get(EventController.URI + "/pending")
      .then()
      .statusCode(200)
      .body("$.size()", equalTo(1))
      .body("id", hasItem(event2.getId().intValue()))
      .body("status", hasItem(event2.getStatus().toString()));
    // @formatter:on
  }
}