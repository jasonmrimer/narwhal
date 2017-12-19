package mil.af.us.narwhal.mission;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Arrays.asList;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(MissionController.class)
@RunWith(SpringRunner.class)
public class MissionControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    MissionRepository repository;

    @Test
    public void index() throws Exception {
        when(repository.findAll()).thenReturn(asList(new Mission("mission-id-1", "MISNUM1")));
        mockMvc.perform(get("/api/missions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].missionId").value("mission-id-1"))
                .andExpect(jsonPath("$[0].atoMissionNumber").value("MISNUM1"));
    }
}