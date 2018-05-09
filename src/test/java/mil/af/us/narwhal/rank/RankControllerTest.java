package mil.af.us.narwhal.rank;

import mil.af.us.narwhal.BaseIntegrationTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.notNullValue;

public class RankControllerTest extends BaseIntegrationTest {
  @Autowired private RankRepository rankRepository;

  @Before
  public void setUp() {
    super.setUp();

    rankRepository.save(asList(
      new Rank("A"),
      new Rank("B"),
      new Rank("C")
    ));
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
        .get(RankController.URI)
      .then()
        .statusCode(200)
        .body("size()", greaterThan(0))
        .body("[0].id", notNullValue())
        .body("[0].abbreviation", notNullValue());
    // @formatter:on
  }
}