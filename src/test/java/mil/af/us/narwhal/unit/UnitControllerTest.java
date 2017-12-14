package mil.af.us.narwhal.unit;

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
@WebMvcTest(UnitController.class)
@RunWith(SpringRunner.class)
public class UnitControllerTest {
  @Autowired MockMvc mockMvc;
  @MockBean UnitRepository unitRepository;

  @Test
  public void indexTest() throws Exception {
    Unit unit1 = new Unit(1L, "1");
    Unit unit2 = new Unit(2L, "2");

    when(unitRepository.findAll()).thenReturn(asList(unit1, unit2));

    mockMvc.perform(get(UnitController.URI))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", equalTo(2)));
  }

}