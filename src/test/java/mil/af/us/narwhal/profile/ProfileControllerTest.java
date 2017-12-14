package mil.af.us.narwhal.profile;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProfileController.class)
@RunWith(SpringRunner.class)
public class ProfileControllerTest {
  @Autowired MockMvc mockMvc;

  @Test
  public void showTest() throws Exception {
    mockMvc.perform(get(ProfileController.URI).with(httpBasic("tytus", "password")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.username").value("tytus"));
  }
}