package mil.af.us.narwhal.roster;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Arrays.asList;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RosterController.class)
@RunWith(SpringRunner.class)
public class RosterControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean AirmanRepository airmanRepository;

    @Test
    public void show() throws Exception {
        when(airmanRepository.findAll())
                .thenReturn(asList(
                        new Airman(1L, "FirstOne", "LastOne"),
                        new Airman(2L, "FirstTwo", "LastTwo"),
                        new Airman(3L, "FirstThree", "LastThree")
                ));

        mockMvc.perform(get("/api/roster"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.airmen").isNotEmpty());
    }
}