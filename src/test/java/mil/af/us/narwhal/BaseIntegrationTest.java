package mil.af.us.narwhal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.crew.CrewPosition;
import mil.af.us.narwhal.crew.CrewPositionRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.profile.Role;
import mil.af.us.narwhal.profile.RoleName;
import mil.af.us.narwhal.profile.RoleRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.Instant;
import java.util.Map;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseIntegrationTest {
  @Autowired SiteRepository siteRepository;
  @Autowired MissionRepository missionRepository;
  @Autowired AirmanRepository airmanRepository;
  @Autowired FlightRepository flightRepository;
  @Autowired private RoleRepository roleRepository;
  @Autowired public CrewPositionRepository crewPositionRepository;
  protected Mission mission;
  protected Flight flight;
  protected Site site;
  protected Role role;
  protected final static ObjectMapper objectMapper = new ObjectMapper();
  protected final static JavaTimeModule module = new JavaTimeModule();

  static {
    objectMapper.registerModule(module);
  }

  @Autowired private JdbcTemplate template;
  @LocalServerPort protected int port;

  public void setUp() {
    role = roleRepository.save(new Role(RoleName.READER));
  }

  public void tearDown() {
    template.execute("SET REFERENTIAL_INTEGRITY FALSE");
    for (Map result : template.queryForList("SHOW TABLES")) {
      template.execute("TRUNCATE TABLE " + result.get("TABLE_NAME"));
    }
    template.execute("SET REFERENTIAL_INTEGRITY TRUE");
  }

  public void buildAirman() {
    flight = new Flight("flight");

    final Squadron squadron = new Squadron("squadron");
    squadron.addFlight(flight);

    site = new Site("site");
    site.addSquadron(squadron);

    siteRepository.save(site);

    Airman airman = new Airman(flight, "FIRST", "LAST");
    airmanRepository.save(airman);

    mission = new Mission("MISSION_ID", "MISSION_NUMBER", Instant.now(), Instant.now(), "U-2", site, Instant.now());
    missionRepository.save(mission);

    CrewPosition crewPosition = new CrewPosition(airman, "TITLE", false);
    crewPosition.setMission(mission);
    crewPosition = crewPositionRepository.save(crewPosition);
    mission.addCrewPosition(crewPosition);
    mission = missionRepository.save(mission);
  }
}
