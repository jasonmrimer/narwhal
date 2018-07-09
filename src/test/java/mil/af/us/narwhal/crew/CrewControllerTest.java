package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.event.EventJSON;
import mil.af.us.narwhal.event.EventStatus;
import mil.af.us.narwhal.event.EventType;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.profile.ProfileRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class CrewControllerTest extends BaseIntegrationTest {
  private Mission mission;
  private Mission emptyMission;
  private Airman airman;
  private Airman airman2;
  private Airman airman3;
  private TemplateItem templateItem;
  private TemplateItem templateItem2;
  private static final String templateTitle = "Title";
  private static final String templateTitle2 = "Title2";
  @Autowired private CrewPositionRepository crewPositionRepository;
  @Autowired private SiteRepository siteRepository;
  @Autowired private MissionRepository missionRepository;
  @Autowired private AirmanRepository airmanRepository;
  @Autowired private TemplateItemRepository templateItemRepository;

  @Before
  public void setUp() {
    super.setUp();

    Flight flight = new Flight();

    Squadron squadron = new Squadron();
    squadron.addFlight(flight);

    Site site = new Site();
    site.addSquadron(squadron);
    siteRepository.save(site);

    airman = airmanRepository.save(new Airman(flight, "A", "B", rank));
    airman2 = airmanRepository.save(new Airman(flight, "B", "C", rank));
    airman3 = airmanRepository.save(new Airman(flight, "C", "D", rank));

    templateItem = templateItemRepository.save(new TemplateItem(1L, 1L, true, 1L));
    templateItem2 = templateItemRepository.save(new TemplateItem(2L, 2L, false, 1L));

    mission = new Mission("A", "B", Instant.now(), Instant.now(), "U-2", site, Instant.now());
    emptyMission = new Mission("C", "D", Instant.now(), Instant.now(), "U-2", site, Instant.now());

    mission.addCrewPosition(new CrewPosition(
      airman2,
      templateTitle2,
      templateItem2.getCritical(),
      templateItem2.getOrder(),
      templateItem2.getTemplateId())
    );

    mission.addCrewPosition(new CrewPosition(
      airman,
      templateTitle,
      templateItem.getCritical(),
      templateItem.getOrder(),
      templateItem.getTemplateId())
    );

    mission = missionRepository.save(mission);
    emptyMission = missionRepository.save(emptyMission);
  }

  @After
  public void tearDown() {
    super.tearDown();
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
      .get(CrewController.URI + "/" + mission.getId())
    .then()
      .statusCode(200)
      .body("id", equalTo(mission.getId().intValue()))
      .body("crewPositions.size()", equalTo(2))
      .body("crewPositions[0].airman.id", equalTo(airman.getId().intValue()))
      .body("crewPositions[0].title", equalTo(templateTitle))
      .body("crewPositions[0].order", equalTo(templateItem.getOrder().intValue()))
      .body("crewPositions[0].templateItemId", equalTo(templateItem.getTemplateId().intValue()))
      .body("crewPositions[0].critical", equalTo(templateItem.getCritical()))
      .body("crewPositions[1].airman.id", equalTo(airman2.getId().intValue()))
      .body("crewPositions[1].title", equalTo(templateTitle2))
      .body("crewPositions[1].order", equalTo(templateItem2.getOrder().intValue()))
      .body("crewPositions[1].templateItemId", equalTo(templateItem2.getTemplateId().intValue()))
      .body("crewPositions[1].critical", equalTo(templateItem2.getCritical()));
    // @formatter:on
  }

  @Test
  public void showEmptyTest() {
    // @formatter:off
    List<TemplateItem> emptyTemplateItems = templateItemRepository.findAllByTemplateId(1L);

    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .when()
      .get(CrewController.URI + "/" + emptyMission.getId())
      .then()
      .statusCode(200)
      .body("id", equalTo(emptyMission.getId().intValue()))
      .body("crewPositions.size()", equalTo(5))
      .body("crewPositions[0].title", equalTo(""))
      .body("crewPositions[0].order", equalTo(emptyTemplateItems.get(0).getOrder()))
      .body("crewPositions[0].templateItemId", equalTo(emptyTemplateItems.get(0).getTemplateId().intValue()))
      .body("crewPositions[0].critical", equalTo(emptyTemplateItems.get(0).getCritical()))
      .body("crewPositions[1].title", equalTo(""))
      .body("crewPositions[1].order", equalTo(emptyTemplateItems.get(1).getOrder()))
      .body("crewPositions[1].templateItemId", equalTo(emptyTemplateItems.get(1).getTemplateId().intValue()))
      .body("crewPositions[1].critical", equalTo(emptyTemplateItems.get(1).getCritical()))
      .body("crewPositions[2].title", equalTo(""))
      .body("crewPositions[2].order", equalTo(emptyTemplateItems.get(2).getOrder()))
      .body("crewPositions[2].templateItemId", equalTo(emptyTemplateItems.get(2).getTemplateId().intValue()))
      .body("crewPositions[2].critical", equalTo(emptyTemplateItems.get(2).getCritical()))
      .body("crewPositions[3].title", equalTo(""))
      .body("crewPositions[3].order", equalTo(emptyTemplateItems.get(3).getOrder()))
      .body("crewPositions[3].templateItemId", equalTo(emptyTemplateItems.get(3).getTemplateId().intValue()))
      .body("crewPositions[3].critical", equalTo(emptyTemplateItems.get(3).getCritical()))
      .body("crewPositions[4].title", equalTo(""))
      .body("crewPositions[4].order", equalTo(emptyTemplateItems.get(4).getOrder()))
      .body("crewPositions[4].templateItemId", equalTo(emptyTemplateItems.get(4).getTemplateId().intValue()))
      .body("crewPositions[4].critical", equalTo(emptyTemplateItems.get(4).getCritical()));
    // @formatter:on
  }

  @Test
  public void createTest() {
    final EventJSON json = new EventJSON(
      mission.getId(),
      "New Mission Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.MISSION,
      EventStatus.APPROVED,
      airman3.getId()
    );

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
      .body(json)
    .when()
      .put(CrewController.URI)
    .then()
      .statusCode(200)
      .body("id", equalTo(json.getId().intValue()));
    // @formatter:on
  }

  @Test
  public void deleteTest() {
    long count = crewPositionRepository.count();

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .contentType("application/json")
    .when()
      .delete(CrewController.URI + "/" + mission.getId() + "/airmen/" + airman.getId())
    .then()
      .statusCode(200);
   // @formatter:on

    assertThat(crewPositionRepository.count()).isEqualTo(count - 1);
  }


}