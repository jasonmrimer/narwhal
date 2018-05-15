package mil.af.us.narwhal.profile;

import com.fasterxml.jackson.core.JsonProcessingException;
import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.site.Site;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.*;

public class ProfileControllerTest extends BaseIntegrationTest {
  @Autowired private ProfileRepository profileRepository;
  private List<Profile> profiles;
  private Site updatedSite;

  @Before
  public void setUp() {
    super.setUp();

    site = siteRepository.save(new Site("Test Site"));
    updatedSite = siteRepository.save(new Site("Upated Site"));
    tytus.setSite(site);
    profiles = profileRepository.save(asList(
      new Profile("other_user", site, adminRole),
      tytus
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
  public void getRoles() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(ProfileController.URI + "/roles")
    .then()
      .statusCode(200)
      .body("size()", greaterThan(0))
      .body("[0].id", notNullValue())
      .body("[0].name", notNullValue());
    // @formatter:on
  }

  @Test
  public void showTest() {
    final Profile profile = profiles.get(0);

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
      .body("roleId", equalTo(profile.getRole().getId().intValue()))
      .body("roleName", equalTo(profile.getRole().getName().name()))
      .body("siteId", equalTo(profile.getSite().getId().intValue()))
      .body("siteName", equalTo(profile.getSite().getFullName()))
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
      .body("roleName", equalTo(RoleName.READER.name()));
    // @formatter:on
  }

  @Test
  public void updateSiteTest() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .param("siteId", updatedSite.getId())
    .when()
      .put(ProfileController.URI + "/me")
    .then()
      .statusCode(200)
      .body("username", equalTo("tytus"))
      .body("siteId", equalTo(updatedSite.getId().intValue()))
      .body("siteName", equalTo(updatedSite.getFullName()));
    // @formatter:on
  }

  @Test
  public void updateRoleTest() throws JsonProcessingException {
    ProfileJSON profileJSON = profiles.get(0).toProfileJSON(true);
    profileJSON.setRoleId(writerRole.getId());
    String json = objectMapper.writeValueAsString(profileJSON);

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .body(json)
      .contentType("application/json")
    .when()
      .put(ProfileController.URI)
    .then()
      .statusCode(200)
      .body("username", equalTo(profiles.get(0).getUsername()))
      .body("roleId", equalTo(writerRole.getId().intValue()))
      .body("roleName", equalTo(writerRole.getName().name()));
    // @formatter:on
  }
}
