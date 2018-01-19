package mil.af.us.narwhal.site;


import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(SiteController.class)
@RunWith(SpringRunner.class)
public class SiteControllerTest {
  @Autowired
  private MockMvc mockMvc;
  @MockBean
  private SiteRepository siteRepository;

  @Test
  public void indexTest() throws Exception {
    final Site site1 = new Site(1L, "Site 1", singletonList(
      new Squadron(1L, 1L, "Squadron 1", singletonList(
        new Flight(1L, 1L, "Flight 1")
      ))
    ));
    final Site site2 = new Site(2L, "Site 2", asList(
      new Squadron(2L, 2L, "Squadron 2", singletonList(
        new Flight(2L, 2L, "Flight 2")
      )),
      new Squadron(3L, 3L, "Squadron 3", asList(
        new Flight(3L, 3L, "Flight 3"),
        new Flight(4L, 3L, "Flight 4")
      ))
    ));

    when(siteRepository.findAll()).thenReturn(asList(site1, site2));

    mockMvc.perform(get(SiteController.URI))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", equalTo(2)))
      .andExpect(jsonPath("$[0].squadrons.size()", equalTo(1)))
      .andExpect(jsonPath("$[0].squadrons[0].flights.size()", equalTo(1)))
      .andExpect(jsonPath("$[1].squadrons.size()", equalTo(2)))
      .andExpect(jsonPath("$[1].squadrons[0].flights.size()", equalTo(1)))
      .andExpect(jsonPath("$[1].squadrons[1].flights.size()", equalTo(2)));
  }
}
