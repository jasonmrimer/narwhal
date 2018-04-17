package mil.af.us.narwhal.profile;

import com.fasterxml.jackson.core.JsonProcessingException;
import mil.af.us.narwhal.BaseIntegrationTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class ProfileControllerTest extends BaseIntegrationTest {
  @Autowired private ProfileRepository profileRepository;

  @Before
  public void setUp() {
    super.setUp();
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void showTest() {
    final Profile profile = profileRepository.save(new Profile("tytus", 123L, role));

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(ProfileController.URI)
    .then()
      .statusCode(200)
      .body("username", equalTo("tytus"))
      .body("siteId", equalTo(profile.getSiteId().intValue()))
      .body("classified", equalTo(false));
    // @formatter:on
  }

  @Test
  public void showNewProfileTest() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(ProfileController.URI)
    .then()
      .statusCode(200)
      .body("username", equalTo("tytus"))
      .body("siteId", equalTo(null));
    // @formatter:on
  }

  @Test
  public void updateProfileTest() throws JsonProcessingException {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .param("siteId", 9001L)
    .when()
      .put(ProfileController.URI)
    .then()
      .statusCode(200)
      .body("username", equalTo("tytus"))
      .body("siteId", equalTo(9001));
    // @formatter:on
  }
}
