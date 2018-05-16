package mil.af.us.narwhal.skill;

import mil.af.us.narwhal.BaseIntegrationTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class QualificationControllerTest extends BaseIntegrationTest {
  @Autowired QualificationRepository qualificationRepository;

  @Before
  public void setUp() {
    super.setUp();

    qualificationRepository.save(new Qualification("Qual", "Qualification"));
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void testShow() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(QualificationController.URI)
    .then()
      .statusCode(200)
      .body("[0].title", equalTo("Qualification"))
      .body("[0].acronym", equalTo("Qual"));
    // @formatter:on
  }
}