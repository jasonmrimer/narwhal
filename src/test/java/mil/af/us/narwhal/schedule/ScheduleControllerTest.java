package mil.af.us.narwhal.schedule;

import mil.af.us.narwhal.BaseIntegrationTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;

public class ScheduleControllerTest extends BaseIntegrationTest {
  @Autowired private ScheduleRepository scheduleRepository;

  @Before
  public void setup() {
    super.setUp();

    scheduleRepository.save(asList(
      new Schedule("Back Half", false, false, false, true, true, true, true),
      new Schedule("Front Half", true, true, true, true, false, false, false)
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
      .get(ScheduleController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(2))
      .body("[0].type", equalTo("Back Half"))
      .body("[1].type", equalTo("Front Half"));
    // @formatter:on
  }
}