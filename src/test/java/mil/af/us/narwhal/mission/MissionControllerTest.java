package mil.af.us.narwhal.mission;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import static java.util.Collections.singletonList;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(MissionController.class)
@RunWith(SpringRunner.class)
public class MissionControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean MissionRepository repository;

    @Test
    public void index() throws Exception {
        when(repository.findAll()).thenReturn(singletonList(
          new Mission(
            "mission-id-1",
            "MISNUM1",
            ZonedDateTime.of(2017, 12, 12, 9, 0, 0, 0, ZoneId.of("UTC")),
            ZonedDateTime.of(2017, 12, 12, 15, 0, 0, 0, ZoneId.of("UTC")))
        ));

        mockMvc.perform(get("/api/missions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].missionId").value("mission-id-1"))
                .andExpect(jsonPath("$[0].atoMissionNumber").value("MISNUM1"))
                .andExpect(jsonPath("$[0].startDateTime").value("2017-12-12T09:00:00Z"))
                .andExpect(jsonPath("$[0].endDateTime").value("2017-12-12T15:00:00Z"));
    }
}