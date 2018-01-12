package mil.af.us.narwhal.mission;

import mil.af.us.narwhal.site.Site;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static java.util.Collections.singletonList;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(MissionController.class)
@RunWith(SpringRunner.class)
public class MissionControllerTest {
  Site site;
  List<Mission> missions;

  @Autowired MockMvc mockMvc;
  @MockBean MissionRepository missionRepository;

  @Before
  public void setUp() {
    site = new Site(1L, "Site-1");
    missions = singletonList(
      new Mission(
        "mission-id-1",
        "MISNUM1",
        Instant.parse("2017-12-12T09:00:00Z"),
        Instant.parse("2017-12-12T15:00:00Z"),
        site)
    );
  }

  @Test
  public void index() throws Exception {
    when(missionRepository.findAll()).thenReturn(missions);

    mockMvc.perform(get("/api/missions"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].missionId").value("mission-id-1"))
      .andExpect(jsonPath("$[0].atoMissionNumber").value("MISNUM1"))
      .andExpect(jsonPath("$[0].startDateTime").value("2017-12-12T09:00:00Z"))
      .andExpect(jsonPath("$[0].endDateTime").value("2017-12-12T15:00:00Z"))
      .andExpect(jsonPath("$[0].site.id").value(site.getId()));
  }

  @Test
  public void indexBySiteId() throws Exception {
    when(missionRepository.findBySiteId(site.getId())).thenReturn(missions);

    mockMvc.perform(get(MissionController.URI).param("site", site.getId().toString()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].missionId").value("mission-id-1"))
      .andExpect(jsonPath("$[0].atoMissionNumber").value("MISNUM1"))
      .andExpect(jsonPath("$[0].startDateTime").value("2017-12-12T09:00:00Z"))
      .andExpect(jsonPath("$[0].endDateTime").value("2017-12-12T15:00:00Z"))
      .andExpect(jsonPath("$[0].site.id").value(site.getId()));
  }
}