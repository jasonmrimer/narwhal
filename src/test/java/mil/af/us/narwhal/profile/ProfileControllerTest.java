package mil.af.us.narwhal.profile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import mil.af.us.narwhal.BaseIntegrationTest;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class ProfileControllerTest extends BaseIntegrationTest {
  @Autowired private ProfileRepository profileRepository;

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void showTest() {
    final Profile profile = profileRepository.save(new Profile("tytus", 123L));

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
      .body("profile.username", equalTo("tytus"))
      .body("profile.siteId", equalTo(profile.getSiteId().intValue()))
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
      .body("profile.username", equalTo("tytus"))
      .body("profile.siteId", equalTo(null));
    // @formatter:on
  }

  @Test
  public void updateProfileTest() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper();
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .body(objectMapper.writeValueAsString(new Profile("FooFace", 1L)))
      .contentType("application/json")
    .when()
      .put(ProfileController.URI)
    .then()
      .statusCode(200)
      .body("profile.username", equalTo("FooFace"))
      .body("profile.siteId", equalTo(1));
    // @formatter:on
  }
}
