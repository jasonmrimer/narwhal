package mil.af.us.narwhal.crew;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Arrays.asList;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(CrewController.class)
@RunWith(SpringRunner.class)
public class CrewControllerTest {
  @Autowired
  MockMvc mockMvc;
  @MockBean
  CrewRepository crewRepository;

  @Test
  public void indexTest() throws Exception {
    Crew crew1 = new Crew(1L, "Super Crew");
    Crew crew2 = new Crew(2L, "Lame Crew");

    when(crewRepository.findAll()).thenReturn(asList(crew1, crew2));

    mockMvc.perform(get(CrewController.URI))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", equalTo(2)));
  }
}