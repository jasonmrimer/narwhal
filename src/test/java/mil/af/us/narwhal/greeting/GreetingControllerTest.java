package mil.af.us.narwhal.greeting;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
@RunWith(SpringRunner.class)
public class GreetingControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean GreetingService greetingService;

    @Test
    public void greeting() throws Exception {
        final Greeting greeting = new Greeting(1L, "Hello!");

        when(greetingService.getRandomGreeting())
                .thenReturn(greeting);

        mockMvc.perform(get("/greeting"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phrase").value(greeting.getPhrase()));
    }
}