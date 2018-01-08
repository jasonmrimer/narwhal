package mil.af.us.narwhal.flight;

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
@WebMvcTest(FlightController.class)
@RunWith(SpringRunner.class)
public class FlightControllerTest {
  @Autowired
  MockMvc mockMvc;
  @MockBean
  FlightRepository flightRepository;

  @Test
  public void indexTest() throws Exception {
    Flight flight1 = new Flight(1L, 1L, "Super Flight");
    Flight flight2 = new Flight(2L, 1L, "Lame Flight");

    when(flightRepository.findAll()).thenReturn(asList(flight1, flight2));

    mockMvc.perform(get(FlightController.URI))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", equalTo(2)));
  }
}