package mil.af.us.narwhal.event;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import mil.af.us.narwhal.profile.Profile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class EventService {
  private EventRepository eventRepository;
  private MissionRepository missionRepository;
  private AirmanRepository airmanRepository;

  public EventService(EventRepository eventRepository, MissionRepository missionRepository, AirmanRepository airmanRepository) {
    this.eventRepository = eventRepository;
    this.missionRepository = missionRepository;
    this.airmanRepository = airmanRepository;
  }

  @PreAuthorize("hasAnyRole('ADMIN', 'WRITER', 'READER')")
  public Event createLeave(EventJSON json, Profile profile) {
    return saveEvent(json, profile);
  }


  @PreAuthorize("hasAnyRole('ADMIN', 'WRITER', 'READER')")
  public Event createAppointment(EventJSON json, Profile profile) {
    return saveEvent(json, profile);
  }

  @PreAuthorize("hasAnyRole('ADMIN', 'WRITER')")
  public Event createTDYDeployment(EventJSON json, Profile profile) {
    return saveEvent(json, profile);
  }

  public Event update(EventJSON json) {
    final Event event = eventRepository.findOne(json.getId());
    return eventRepository.save(event.update(json));
  }

  public List<Event> combineCrewsAndEventsBySite(Long siteId, Instant start, Instant end) {
    List<Mission> missions = this.missionRepository
      .findAllBySiteIdAndOverlappingDuration(siteId, start, end);
    List<Event> events = this.eventRepository
      .findAllBySiteIdAndOverlappingDuration(siteId, start, end);
    return Stream.concat(
      missions.stream().map(Mission::toAllEvents).flatMap(Collection::stream),
      events.stream()
    ).collect(Collectors.toList());
  }

  public List<Event> combineCrewsAndEventsByAirman(Long airmanId, Instant start, Instant end) {
    List<Mission> missions = this.missionRepository
      .findAllByAirmanIdAndOverlappingDuration(airmanId, start, end);
    List<Event> events = this.eventRepository
      .findAllByAirmanIdAndOverlappingDuration(airmanId, start, end);
    return Stream.concat(
      missions.stream().map(m -> m.toEvent(airmanId)),
      events.stream()
    ).collect(Collectors.toList());
  }

  private Event saveEvent(EventJSON json, Profile profile) {
    final Airman airman = airmanRepository.findOne(json.getAirmanId());
    final Event event = Event.fromJSON(json, airman);

    event.setCreatedBy(profile.getUsername());
    event.setCreatedOn(Instant.now());

    return eventRepository.save(event);
  }
}
