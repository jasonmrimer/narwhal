package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.BaseIntegrationTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class AdminSquadronControllerTest extends BaseIntegrationTest {

  @Before
  public void setUp() {
    super.setUp();
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
      .get(AdminSquadronController.URI)
      .then()
      .statusCode(200)
      .body("$.size()", equalTo(2))
      .body("[0].siteId", equalTo(1))
      .body("[0].siteName", equalTo("site"))
      .body("[0].squadronId", equalTo(1))
      .body("[0].squadronName", equalTo("squadron"))
      .body("[1].siteId", equalTo(1))
      .body("[1].siteName", equalTo("site"))
      .body("[1].squadronId", equalTo(2))
      .body("[1].squadronName", equalTo("squadron2"));
    //    // @formatter:on
  }
}
