package mil.af.us.narwhal.site;

import mil.af.us.narwhal.flight.Flight;
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

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class SiteControllerTest {
  @LocalServerPort private int port;
  @Autowired private SiteRepository siteRepository;

  @Before
  public void setUp() {
    final Flight flight1 = new Flight("flight1");

    final Squadron squad1 = new Squadron("squad1");
    squad1.addFlight(flight1);

    final Site site1 = new Site("site1");
    site1.addSquadron(squad1);

    final Flight flight2 = new Flight("flight2");

    final Squadron squad2 = new Squadron("squadron2");
    squad2.addFlight(flight2);

    final Flight flight3 = new Flight("flight3");
    final Flight flight4 = new Flight("flight4");

    final Squadron squad3 = new Squadron("squadron3");
    squad3.addFlight(flight3);
    squad3.addFlight(flight4);

    final Site site2 = new Site("site2");
    site2.addSquadron(squad2);
    site2.addSquadron(squad3);

    siteRepository.save(asList(site1, site2));
  }

  @Test
  public void indexTest() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(SiteController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(2))
      .body("[0].squadrons.size()", equalTo(1))
      .body("[0].squadrons[0].flights.size()", equalTo(1))
      .body("[1].squadrons.size()", equalTo(2))
      .body("[1].squadrons[0].flights.size()", equalTo(1))
      .body("[1].squadrons[1].flights.size()", equalTo(2));
    // @formatter:on
  }
}