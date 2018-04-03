package mil.af.us.narwhal.event;

import mil.af.us.narwhal.crew.CrewService;
import mil.af.us.narwhal.mission.MissionRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class EventServiceTest {

  @Mock private EventRepository eventRepository;
  @Mock private MissionRepository missionRepository;
  @Captor private ArgumentCaptor<Event> eventArgumentCaptor;
  private EventService subject;
  private Event event;
  @Mock private CrewService crewService;

  @Before
  public void setUp() {
    event = new Event(
      "New Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.APPOINTMENT,
      1L
    );
  }

  @Test
  public void save_savesNonMissionEventToEvents() {
    when(eventRepository.save(event))
      .thenReturn(event);

    subject = new EventService(eventRepository, crewService, missionRepository);

    subject.save(event);

    verify(eventRepository).save(eventArgumentCaptor.capture());
    assertThat(eventArgumentCaptor.getValue()).isEqualTo(event);
  }

  @Test
  public void save_savesMissionEventToCrew() {
    final Event missionEvent = new Event(
      "New Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.MISSION,
      1L
    );

    when(crewService.save(any(Event.class)))
      .thenReturn(missionEvent);

    subject = new EventService(eventRepository, crewService, missionRepository);

    final Event event = subject.save(missionEvent);

    assertThat(event).isEqualTo(missionEvent);
  }
}