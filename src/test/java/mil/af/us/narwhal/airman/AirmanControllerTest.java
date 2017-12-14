package mil.af.us.narwhal.airman;

import mil.af.us.narwhal.certification.Certification;
import mil.af.us.narwhal.qualification.Qualification;
import mil.af.us.narwhal.unit.Unit;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static java.util.Collections.singletonList;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(AirmanController.class)
@RunWith(SpringRunner.class)
public class AirmanControllerTest {
  Unit unit;
  List<Airman> airmen;

  @Autowired MockMvc mockMvc;
  @MockBean AirmanRepository airmanRepository;

  @Before
  public void setUp() {
    unit = new Unit(1L, "1");

    final Qualification qualification1 = new Qualification(1L, "Qual1", "qualification1");

    final Certification certification1 = new Certification(1L, "Certification 1");

    airmen = singletonList(
      new Airman(1L, "FirstOne", "LastOne", singletonList(qualification1), singletonList(certification1), unit)
    );
  }

  @Test
  public void index() throws Exception {
    when(airmanRepository.findAll()).thenReturn(airmen);

    mockMvc.perform(get(AirmanController.URI))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", Matchers.equalTo(1)))
      .andExpect(jsonPath("$[0]").value(airmen.get(0)));
  }

  @Test
  public void indexByUnitId() throws Exception {
    when(airmanRepository.findByUnitId(unit.getId())).thenReturn(airmen);

    mockMvc.perform(get(AirmanController.URI).param("unit", unit.getId().toString()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", Matchers.equalTo(1)))
      .andExpect(jsonPath("$[0]").value(airmen.get(0)));
  }
}