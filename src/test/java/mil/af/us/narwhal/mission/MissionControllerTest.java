package mil.af.us.narwhal.mission;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.Instant;
import java.util.List;

import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class MissionControllerTest {
  private Site site1;
  private Site site2;
  @LocalServerPort private int port;
  @Autowired private SiteRepository siteRepository;
  @Autowired private MissionRepository missionRepository;

  @Before
  public void setUp() {
    site1 = new Site("Site-1");
    site2 = new Site("Site-2");
    siteRepository.save(asList(site1, site2));

    final List missions = asList(
      new Mission(
        "mission-id-1",
        "MISNUM1",
        Instant.parse("2017-12-12T09:00:00Z"),
        Instant.parse("2017-12-12T15:00:00Z"),
        site1
      ),
      new Mission(
        "mission-id-2",
        "MISNUM2",
        Instant.parse("2017-12-12T09:00:00Z"),
        Instant.parse("2017-12-12T15:00:00Z"),
        site2
      )
    );
    missionRepository.save(missions);
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
      .body("[0].startDateTime", equalTo("2017-12-12T09:00:00Z"))
      .body("[0].endDateTime", equalTo("2017-12-12T15:00:00Z"))
      .body("[0].site.id", equalTo(site1.getId().intValue()))

      .body("[1].missionId", equalTo("mission-id-2"))
      .body("[1].atoMissionNumber", equalTo("MISNUM2"))
      .body("[1].startDateTime", equalTo("2017-12-12T09:00:00Z"))
      .body("[1].endDateTime", equalTo("2017-12-12T15:00:00Z"))
      .body("[1].site.id", equalTo(site2.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void indexBySiteId() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .queryParam("site", site1.getId())
    .when()
      .get(MissionController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(1))
      .body("[0].missionId", equalTo("mission-id-1"))
      .body("[0].atoMissionNumber", equalTo("MISNUM1"))
      .body("[0].startDateTime", equalTo("2017-12-12T09:00:00Z"))
      .body("[0].endDateTime", equalTo("2017-12-12T15:00:00Z"))
      .body("[0].site.id", equalTo(site1.getId().intValue()));
    // @formatter:on
  }
}