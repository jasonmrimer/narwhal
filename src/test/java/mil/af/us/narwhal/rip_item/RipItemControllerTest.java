package mil.af.us.narwhal.rip_item;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import mil.af.us.narwhal.airman.*;
import mil.af.us.narwhal.flight.Flight;
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
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class RipItemControllerTest {
  @LocalServerPort private int port;
  @Autowired private AirmanRepository airmanRepository;
  @Autowired private SiteRepository siteRepository;
  @Autowired private RipItemRepository ripItemRepository;
  @Autowired private AirmanRipItemRepository airmanRipItemRepository;

  private Airman airman;
  private RipItem ripItem1 = new RipItem(1L, "Distress Signal");

  @Before
  public void setup() {
    Flight flight = new Flight();

    Squadron squadron = new Squadron();
    squadron.addFlight(flight);

    Site site = new Site();
    site.addSquadron(squadron);
    siteRepository.save(site);

    airman = new Airman(flight, "A", "B");
    airmanRepository.save(airman);

    ripItemRepository.save(ripItem1);

    AirmanRipItem airmanRipItem = new AirmanRipItem(1L, airman.getId(), ripItem1, null);

    airman.addRipItem(airmanRipItem);

    airmanRepository.save(airman);
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
    JavaTimeModule module = new JavaTimeModule();
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(module);

    AirmanRipItemJSON airmanRipItem = new AirmanRipItemJSON(1L, airman.getId(), ripItem1, Instant.now());

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

    final Instant updatedExpirationDate = airmanRipItemRepository.findOne(1L).getExpirationDate();

    assertTrue(updatedExpirationDate.equals(airmanRipItem.getExpirationDate()));
  }
}