package mil.af.us.narwhal.event;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.profile.Profile;
import mil.af.us.narwhal.profile.ProfileRepository;
import mil.af.us.narwhal.profile.Role;
import mil.af.us.narwhal.profile.RoleName;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class EventServiceTest {
  @Mock private EventRepository eventRepository;
  @Mock private MissionRepository missionRepository;
  @Mock private AirmanRepository airmanRepository;
  @Mock private ProfileRepository profileRepository;
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

  @Test
  public void pendingEventCountBySiteId(){
    Instant now = Instant.now();
    Instant sixtyDaysFromNow = now.plus(60, ChronoUnit.DAYS);
    when(eventRepository.findPendingCountBySiteId(1L, now, sixtyDaysFromNow))
    .thenReturn(1L);
    subject = new EventService(eventRepository, missionRepository, airmanRepository);
    final Long result = subject.pendingEventCountBySiteId(
      1L,
      now,
      sixtyDaysFromNow
    );
    assertThat(result).isEqualTo(1L);
  }

  @Test
  public void setApproval(){
    Event event = new Event(
    "Event",
      "",
      Instant.now(),
      Instant.now(),
      EventType.APPOINTMENT,
      EventStatus.PENDING,
      airman);

    EventApprovalJSON eventApprovalJSON = new EventApprovalJSON(
      1L,
      EventApproval.APPROVED,
      EventApprovalRole.SUPERVISOR
    );

    Profile tytus = profileRepository.save(new Profile("tytus", new Role(RoleName.ADMIN)));
    subject = new EventService(eventRepository, missionRepository, airmanRepository);

    event = subject.setApproval(event, eventApprovalJSON, tytus);

    assertThat(event.getSupervisorApproval()).isEqualTo(EventApproval.APPROVED);
  }
}
