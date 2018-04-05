package mil.af.us.narwhal.event;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.crew.CrewService;
import mil.af.us.narwhal.mission.MissionRepository;
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
  @Mock private CrewService crewService;
  @Mock private Airman airman;
  @Captor private ArgumentCaptor<Event> eventArgumentCaptor;
  private EventService subject;

  @Test
  public void update_updatesNonMissionEventToEvents() {
    EventJSON json = new EventJSON(
      123L,
      "New Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.APPOINTMENT,
      456L
    );

    Event event = Event.fromJSON(json, airman);

    when(eventRepository.findOne(json.getId()))
      .thenReturn(event);

    when(eventRepository.save(event))
      .thenReturn(event);

    subject = new EventService(eventRepository, crewService, missionRepository);

    subject.update(json);

    verify(eventRepository).save(eventArgumentCaptor.capture());
    assertThat(eventArgumentCaptor.getValue()).isEqualTo(event);
  }

  @Test
  public void update_updatesMissionEventToCrew() {
    final EventJSON json = new EventJSON(
      123L,
      "New Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.MISSION,
      456L
    );

    final Event returnedEvent = Event.fromJSON(json, airman);

    when(crewService.save(json))
      .thenReturn(returnedEvent);

    subject = new EventService(eventRepository, crewService, missionRepository);
    final Event event = subject.update(json);
    assertThat(event).isEqualTo(returnedEvent);
  }
}