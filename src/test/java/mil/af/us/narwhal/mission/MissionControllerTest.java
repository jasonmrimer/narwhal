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
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
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
  private Instant time = Instant.now();
  private Instant future = Instant.now().plus(2, ChronoUnit.DAYS);

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
        "mission-id-2",
        "MISNUM2",
        Instant.parse("2017-12-12T09:00:00Z"),
        Instant.parse("2017-12-12T15:00:00Z"),
        site2
      ),
      new Mission(
        "mission-id-3",
        "MISNUM3",
        future,
        future,
        site2
      ),
      new Mission(
        "mission-id-1",
        "MISNUM1",
        time,
        time,
        site1
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
      .body("[0].startDateTime", equalTo(time.toString()))
      .body("[0].endDateTime", equalTo(time.toString()))
      .body("[0].site.id", equalTo(site1.getId().intValue()))

      .body("[1].missionId", equalTo("mission-id-3"))
      .body("[1].atoMissionNumber", equalTo("MISNUM3"))
      .body("[1].startDateTime", equalTo(future.toString()))
      .body("[1].endDateTime", equalTo(future.toString()))
      .body("[1].site.id", equalTo(site2.getId().intValue()));
    // @formatter:on
  }
}