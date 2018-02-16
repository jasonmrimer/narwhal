package mil.af.us.narwhal.profile;

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
}
