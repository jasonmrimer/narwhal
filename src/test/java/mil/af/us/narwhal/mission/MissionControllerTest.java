package mil.af.us.narwhal.mission;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.nullValue;

public class MissionControllerTest extends BaseIntegrationTest {
  private Site site1;
  private Site site2;
  private Instant time = Instant.now();
  private Instant future = Instant.now().plus(2, ChronoUnit.DAYS);
  @Autowired private SiteRepository siteRepository;
  @Autowired private MissionRepository missionRepository;

  @Before
  public void setUp() {
    site1 = new Site("Site-1");
    site2 = new Site("Site-2");
    siteRepository.save(asList(site1, site2));

    final List<Mission> missions = asList(
      new Mission(
        "mission-id-2",
        "MISNUM2",
        Instant.parse("2017-12-12T09:00:00Z"),
        Instant.parse("2017-12-12T15:00:00Z"),
        "U-2",
        site2
      ),
      new Mission(
        "mission-id-3",
        "MISNUM3",
        future,
        future,
        "U-2",
        site2
      ),
      new Mission(
        "mission-id-1",
        "MISNUM1",
        time,
        time,
        "Global Hawk",
        site1
      )
    );
    missionRepository.save(missions);
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void index() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(MissionController.URI)
    .then()
      .statusCode(200)

      .body("$.size()", equalTo(2))

      .body("[0].missionId", equalTo("mission-id-1"))
      .body("[0].atoMissionNumber", equalTo("MISNUM1"))
      .body("[0].startDateTime", equalTo(time.toString()))
      .body("[0].endDateTime", equalTo(time.toString()))
      .body("[0].site.id", equalTo(site1.getId().intValue()))

      .body("[1].missionId", equalTo("mission-id-3"))
      .body("[1].atoMissionNumber", equalTo("MISNUM3"))
      .body("[1].startDateTime", equalTo(future.toString()))
      .body("[1].endDateTime", equalTo(future.toString()))
      .body("[1].site.id", equalTo(site2.getId().intValue()))
      .body("[1].platform", equalTo("U-2"));
    // @formatter:on
  }

  @Test
  public void findPlatforms() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("siteId", site2.getId())
      .queryParam("startDateTime", time.toString())
      .queryParam("endDateTime", future.toString())
    .when()
      .get(MissionController.URI + "/platforms")
    .then()
      .statusCode(200)
      .body("[0]", equalTo("U-2"));
    // @formatter:on
  }

  @Test
  public void findAllPlatforms() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("startDateTime", time.toString())
      .queryParam("endDateTime", future.toString())
    .when()
      .get(MissionController.URI + "/platforms")
    .then()
      .statusCode(200)
      .body("[0]", equalTo("U-2"))
      .body("[1]", equalTo("Global Hawk"))
      .body("[2]", nullValue());
    // @formatter:on
  }
}