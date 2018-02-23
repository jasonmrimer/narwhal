package mil.af.us.narwhal.profile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;


@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class ProfileControllerTest {
  @LocalServerPort private int port;
  @Autowired private ProfileRepository profileRepository;

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
      .body("username", equalTo("tytus"))
      .body("siteId", equalTo(profile.getSiteId().intValue()));
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
      .body("username", equalTo("FooFace"))
      .body("siteId", equalTo(1));
    // @formatter:on
  }
}
