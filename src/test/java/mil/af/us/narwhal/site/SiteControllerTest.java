package mil.af.us.narwhal.site;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;

public class SiteControllerTest extends BaseIntegrationTest {
  @Autowired private SiteRepository siteRepository;
  Site site1;

  @Before
  public void setUp() {
    super.setUp();

    final Flight flight1 = new Flight("flight1");

    final Squadron squad1 = new Squadron("squad1");
    squad1.addFlight(flight1);

		site1 = new Site("site1");
    site1.setFullName("siteOne");
    site1.addSquadron(squad1);
    site1.setSiteType(SiteType.DGSCoreSite);

    final Flight flight2 = new Flight("flight2");

    final Squadron squad2 = new Squadron("squadron2");
    squad2.addFlight(flight2);

    final Flight flight3 = new Flight("flight3");
    final Flight flight4 = new Flight("flight4");

    final Squadron squad3 = new Squadron("squadron3");
    squad3.addFlight(flight3);
    squad3.addFlight(flight4);

    final Site site2 = new Site("site2");
    site2.setFullName("siteTwo");
    site2.addSquadron(squad2);
    site2.addSquadron(squad3);
    site2.setSiteType(SiteType.DMSSite);

    siteRepository.save(asList(site1, site2));
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
    .when()
      .get(SiteController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(3))
      .body("[1].squadrons.size()", equalTo(1))
      .body("[1].squadrons[0].flights.size()", equalTo(1))
      .body("[1].siteType", equalTo("DGSCoreSite"))
      .body("[1].fullName", equalTo("siteOne"))
      .body("[2].squadrons.size()", equalTo(2))
      .body("[2].squadrons[0].flights.size()", equalTo(1))
      .body("[2].squadrons[1].flights.size()", equalTo(2))
      .body("[2].siteType", equalTo("DMSSite"))
      .body("[2].fullName", equalTo("siteTwo"));
    // @formatter:on
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
			.get(SiteController.URI + "/" + site1.getId())
			.then()
			.statusCode(200)
			.body("squadrons.size()", equalTo(1));
		// @formatter:on
	}
}