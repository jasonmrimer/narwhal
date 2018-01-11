package mil.af.us.narwhal.certification;

import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Collections.singletonList;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(CertificationController.class)
@RunWith(SpringRunner.class)
public class CertificationControllerTest {
  @Autowired private MockMvc mockMvc;
  @MockBean private CertificationRepository certificationRepository;

  @Test
  public void index() throws Exception {
    final Certification certification = new Certification(1L, "Test Cert");

    when(certificationRepository.findAll()).thenReturn(singletonList(certification));

    mockMvc.perform(get(CertificationController.URI))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", Matchers.equalTo(1)))
      .andExpect(jsonPath("$[0].id").value(certification.getId()))
      .andExpect(jsonPath("$[0].title").value(certification.getTitle()));
  }

}