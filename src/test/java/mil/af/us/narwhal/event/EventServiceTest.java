package mil.af.us.narwhal.event;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.profile.Profile;
import mil.af.us.narwhal.profile.Role;
import mil.af.us.narwhal.profile.RoleName;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class EventServiceTest {
  @Mock private EventRepository eventRepository;
  @Mock private MissionRepository missionRepository;
  @Mock private AirmanRepository airmanRepository;
  @Mock private Airman airman;
  @Captor private ArgumentCaptor<Event> eventArgumentCaptor;
  private EventService subject;

  @Test
  public void createNewEvent() {
    EventJSON json = new EventJSON(
      null,
      "New Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.APPOINTMENT,
      EventStatus.APPROVED,
      456L
    );

    Event event = Event.fromJSON(json, airman);

    Profile profile = new Profile("admin", new Role(RoleName.ADMIN));

    when(airmanRepository.findOne(json.getAirmanId()))
      .thenReturn(airman);

    when(eventRepository.save(event))
      .thenReturn(event);

    subject = new EventService(eventRepository, missionRepository, airmanRepository);

    subject.createAppointment(json, profile);

    verify(eventRepository).save(eventArgumentCaptor.capture());

    assertThat(eventArgumentCaptor.getValue().getTitle()).isEqualTo(event.getTitle());
    assertThat(eventArgumentCaptor.getValue().getDescription()).isEqualTo(event.getDescription());
    assertThat(eventArgumentCaptor.getValue().getStartTime()).isEqualTo(event.getStartTime());
    assertThat(eventArgumentCaptor.getValue().getEndTime()).isEqualTo(event.getEndTime());
    assertThat(eventArgumentCaptor.getValue().getType()).isEqualTo(event.getType());
  }

  @Test
  public void updateExistingEvent() {
    EventJSON json = new EventJSON(
      123L,
      "New Event",
      "New Description",
      Instant.now(),
      Instant.now(),
      EventType.APPOINTMENT,
      EventStatus.APPROVED,
      456L
    );

    Event event = Event.fromJSON(json, airman);

    when(eventRepository.findOne(json.getId()))
      .thenReturn(event);

    when(eventRepository.save(event))
      .thenReturn(event);

    subject = new EventService(eventRepository, missionRepository, airmanRepository);

    subject.update(json);

    verify(eventRepository).save(eventArgumentCaptor.capture());
    assertThat(eventArgumentCaptor.getValue()).isEqualTo(event);
  }
}
