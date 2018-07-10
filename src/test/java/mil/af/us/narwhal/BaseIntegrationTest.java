package mil.af.us.narwhal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sun.org.apache.xpath.internal.operations.Bool;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.crew.*;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.profile.*;
import mil.af.us.narwhal.rank.Rank;
import mil.af.us.narwhal.rank.RankRepository;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseIntegrationTest {
  protected final static ObjectMapper objectMapper = new ObjectMapper();
  protected final static JavaTimeModule module = new JavaTimeModule();

  @Autowired protected SiteRepository siteRepository;
  @Autowired protected MissionRepository missionRepository;
  @Autowired protected AirmanRepository airmanRepository;
  @Autowired protected FlightRepository flightRepository;
  @Autowired protected RoleRepository roleRepository;
  @Autowired protected CrewPositionRepository crewPositionRepository;
  @Autowired protected RankRepository rankRepository;
  @Autowired protected ProfileRepository profileRepository;
  @Autowired protected TemplateRepository templateRepository;
  @Autowired protected TemplateItemRepository templateItemRepository;

  public Profile tytus;
  protected Mission mission;
  protected Flight flight;
  protected Site site;
  protected Role adminRole;
  protected Role readerRole;
  protected Role writerRole;
  protected Rank rank;
  protected Template defaultTemplate;
  protected TemplateItem defaultTemplateItem0;
  protected TemplateItem defaultTemplateItem1;
  protected TemplateItem defaultTemplateItem2;
  protected TemplateItem defaultTemplateItem3;
  protected TemplateItem defaultTemplateItem4;

  static {
    objectMapper.registerModule(module);
  }

  @Autowired private JdbcTemplate template;
  @LocalServerPort protected int port;

  public void setUp() {
    flight = new Flight("flight");

    final Squadron squadron = new Squadron("squadron");
    squadron.addFlight(flight);

    site = new Site("site");
    site.addSquadron(squadron);

    siteRepository.save(site);

    rank = rankRepository.save(new Rank("No Rank"));

    readerRole = roleRepository.findByName(RoleName.READER);
    if( readerRole == null){
      readerRole = roleRepository.save(new Role(RoleName.READER));
    }
    writerRole = roleRepository.findByName(RoleName.WRITER);
    if( writerRole  == null){
      writerRole = roleRepository.save(new Role(RoleName.WRITER));
    }
    adminRole = roleRepository.findByName(RoleName.ADMIN);
    if( adminRole  == null){
      adminRole = roleRepository.save(new Role(RoleName.ADMIN));
    }
    tytus = profileRepository.findOneByUsername("tytus");
    if(tytus == null){
      tytus = profileRepository.save(new Profile("tytus",  site, adminRole, "password"));
    }
  }

  public void tearDown() {
    template.execute("SET REFERENTIAL_INTEGRITY FALSE");
    for (Map result : template.queryForList("SHOW TABLES")) {
      template.execute("TRUNCATE TABLE " + result.get("TABLE_NAME"));
    }
    template.execute("SET REFERENTIAL_INTEGRITY TRUE");
  }

  public void buildAirman() {
    Airman airman = new Airman(flight, "FIRST", "LAST", rank);
    airmanRepository.save(airman);

    mission = new Mission("MISSION_ID", "MISSION_NUMBER", Instant.now(), Instant.now(), "U-2", site, Instant.now());
    missionRepository.save(mission);

    CrewPosition crewPosition = new CrewPosition(airman, "TITLE", false, 13L, 1L);
    crewPosition.setMission(mission);
    crewPosition = crewPositionRepository.save(crewPosition);
    mission.addCrewPosition(crewPosition);
    mission = missionRepository.save(mission);
  }

  public void buildTemplates() {
    defaultTemplate = templateRepository.findOne(1L);
    if(defaultTemplate == null){
      defaultTemplate = templateRepository.save(new Template(1L, "Default"));
    }

    defaultTemplateItem0 = BuildTemplateItem(1L, 1L, true, defaultTemplate.getId());
    defaultTemplateItem1 = BuildTemplateItem(2L, 2L, true, defaultTemplate.getId());
    defaultTemplateItem2 = BuildTemplateItem(3L, 3L, true, defaultTemplate.getId());
    defaultTemplateItem3 = BuildTemplateItem(4L, 4L, false, defaultTemplate.getId());
    defaultTemplateItem4 = BuildTemplateItem(5L, 5L, false, defaultTemplate.getId());
  }

  private TemplateItem BuildTemplateItem(Long id, Long order, Boolean critical, Long templateId) {
    TemplateItem current = templateItemRepository.findOne(id);
    if(current == null){
      current = templateItemRepository.save(new TemplateItem(id, order, critical, templateId));
    }
    return current;
  }
}
