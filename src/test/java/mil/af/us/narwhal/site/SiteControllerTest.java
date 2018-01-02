package mil.af.us.narwhal.site;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(SiteController.class)
@RunWith(SpringRunner.class)
public class SiteControllerTest {
  @Autowired MockMvc mockMvc;
  @MockBean SiteRepository siteRepository;

  @Test
  public void indexTest() throws Exception {
    Site site1 = new Site(1L, "Site 1");
    Site site2 = new Site(2L, "Site 2");

    when(siteRepository.findAll()).thenReturn(asList(site1, site2));

    mockMvc.perform((get(SiteController.URI)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.size()", equalTo(2)));
  }
}
