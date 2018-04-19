package mil.af.us.narwhal.profile;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.site.Site;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;

public class ProfileControllerTest extends BaseIntegrationTest {
  @Autowired private ProfileRepository profileRepository;
  private List<Profile> profiles;
  private Site upatedSite;

  @Before
  public void setUp() {
    super.setUp();

    site = siteRepository.save(new Site("Test Site"));
    upatedSite = siteRepository.save(new Site("Upated Site"));

    profiles = profileRepository.save(asList(
      new Profile("tytus", site, adminRole, "password"),
      new Profile("smytus", site, adminRole)
    ));
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void indexTestAsAdmin() {
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
      .body("size()", equalTo(2));
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
      .get(ProfileController.URI + "/me")
    .then()
      .statusCode(200)
      .body("username", equalTo("tytus"))
      .body("siteId", equalTo(profiles.get(0).getSite().getId().intValue()))
      .body("siteName", equalTo(profiles.get(0).getSite().getFullName()))
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
      .basic("goober", "password")
    .when()
      .get(ProfileController.URI + "/me")
    .then()
      .statusCode(200)
      .body("username", equalTo("goober"))
      .body("siteId", equalTo(null))
      .body("role", equalTo(RoleName.READER.name()));
    // @formatter:on
  }

  @Test
  public void updateProfileTest() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .param("siteId", upatedSite.getId())
    .when()
      .put(ProfileController.URI)
    .then()
      .statusCode(200)
      .body("username", equalTo("tytus"))
      .body("siteId", equalTo(upatedSite.getId().intValue()))
      .body("siteName", equalTo(upatedSite.getFullName()));
    // @formatter:on
  }
}
