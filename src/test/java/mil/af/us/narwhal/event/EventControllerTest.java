package mil.af.us.narwhal.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.stubbing.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(EventController.class)
@RunWith(SpringRunner.class)
public class EventControllerTest {
  private final static ObjectMapper objectMapper = new ObjectMapper();
  private final static JavaTimeModule module = new JavaTimeModule();

  @Autowired private MockMvc mockMvc;
  @MockBean private EventRepository repository;
  @Captor private ArgumentCaptor<Long> eventCaptor;

  static {
    objectMapper.registerModule(module);
  }

  @Test
  public void createTest() throws Exception {
    when(repository.save(any(Event.class)))
      .thenAnswer((Answer<Event>) invocation -> {
        Event event = (Event) invocation.getArguments()[0];
        event.setId(123L);
        return event;
      });

    final Event event = new Event(
      null,
      "New Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.APPOINTMENT,
      20L
    );

    final String json = objectMapper.writeValueAsString(event);

    mockMvc.perform(
      post(EventController.URI)
        .content(json)
        .contentType(MediaType.APPLICATION_JSON)
        .with(httpBasic("tytus", "password")))
      .andExpect(status().isCreated())
      .andExpect(jsonPath("$.id").value(123L));
  }

  @Test
  public void updateTest() throws Exception {
    Event existingEvent = new Event(1L, "Event", "", Instant.now(), Instant.now(), EventType.APPOINTMENT, 1L);
    when(repository.save(any(Event.class))).thenReturn(existingEvent);

    final String json = objectMapper.writeValueAsString(existingEvent);
    mockMvc.perform(
      put(EventController.URI + "/1")
        .content(json)
        .contentType(MediaType.APPLICATION_JSON)
        .with(httpBasic("tytus", "password")))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id").value(1L));
  }

  @Test
  public void deleteTest() throws Exception {
    mockMvc.perform(delete(EventController.URI + "/1")
      .contentType(MediaType.APPLICATION_JSON)
      .with(httpBasic("tytus", "password")))
      .andExpect(status().is(200));

    verify(repository).delete(eventCaptor.capture());
    assertThat(eventCaptor.getValue()).isEqualTo(1);
  }
}