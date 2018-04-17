package mil.af.us.narwhal.rip_item;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.airman.AirmanRipItemJSON;
import mil.af.us.narwhal.airman.AirmanRipItemRepository;
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
import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class RipItemControllerTest extends BaseIntegrationTest {
  @Autowired private AirmanRepository airmanRepository;
  @Autowired private SiteRepository siteRepository;
  @Autowired private RipItemRepository ripItemRepository;
  @Autowired private AirmanRipItemRepository airmanRipItemRepository;

  private Airman airman;
  private RipItem ripItem;

  @Before
  public void setup() {
    super.setUp();

    Flight flight = new Flight();

    Squadron squadron = new Squadron();
    squadron.addFlight(flight);

    Site site = new Site();
    site.addSquadron(squadron);
    siteRepository.save(site);

    ripItem = ripItemRepository.save(new RipItem("Distress Signal"));

    airman = new Airman(flight, "A", "B");
    airmanRepository.save(airman);
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
      .queryParam("id", airman.getId())
    .when()
      .get(RipItemController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(1))
      .body("[0].ripItem.title", equalTo("Distress Signal"));
    // @formatter:on

    assertNull(airmanRipItemRepository.findOne(1L).getExpirationDate());
  }

  @Test
  public void updateTest() throws Exception {
    AirmanRipItemJSON airmanRipItem = new AirmanRipItemJSON(
      airman.getRipItems().get(0).getId(),
      airman.getId(),
      ripItem,
      Instant.now()
    );
    final String json = objectMapper.writeValueAsString(singletonList(airmanRipItem));

    // @formatter:off
     given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .put(RipItemController.URI )
    .then()
      .statusCode(200)
      .body("[0].ripItem.title", equalTo("Distress Signal"));
    // @formatter:on

    final Instant updatedExpirationDate = airmanRipItemRepository.findOne(airmanRipItem.getId()).getExpirationDate();
    assertTrue(updatedExpirationDate.equals(airmanRipItem.getExpirationDate()));
  }
}