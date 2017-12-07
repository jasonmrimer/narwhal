package mil.af.us.narwhal.roster;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.qualification.Qualification;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.hasSize;
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
        Qualification qualification1 = new Qualification(1L, "Qual1", "qualification1");

        when(airmanRepository.findAll())
                .thenReturn(singletonList(
                        new Airman(1L, "FirstOne", "LastOne", singletonList(qualification1))
                ));

        mockMvc.perform(get("/api/roster"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.airmen").isNotEmpty())
                .andExpect(jsonPath("$.airmen[0].qualifications", hasSize(1)));
    }
}