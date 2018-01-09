package mil.af.us.narwhal.squadron;

import mil.af.us.narwhal.flight.Flight;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(SquadronController.class)
@RunWith(SpringRunner.class)
public class SquadronControllerTest {
  @Autowired MockMvc mockMvc;
  @MockBean
  SquadronRepository squadronRepository;

  @Test
  public void index() throws Exception {
    Flight flight1 = new Flight(1L, 1L, "F1");
    Flight flight2 = new Flight(2L, 1L, "F2");
    Squadron squadron1 = new Squadron(1L, "1", asList(flight1, flight2));
    Squadron squadron2 = new Squadron(2L, "2", null);

    when(squadronRepository.findAll()).thenReturn(asList(squadron1, squadron2));

    mockMvc.perform(get(SquadronController.URI))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", equalTo(2)))
      .andExpect(jsonPath("$[0].flights.size()", equalTo(2)))
      .andExpect(jsonPath("$[1].flights", is(nullValue())));
  }
}