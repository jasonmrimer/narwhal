package mil.af.us.narwhal.event;

import mil.af.us.narwhal.crew.CrewService;
import mil.af.us.narwhal.mission.Mission;
import mil.af.us.narwhal.mission.MissionRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class EventService {
  private EventRepository eventRepository;
  private CrewService crewService;
  private MissionRepository missionRepository;

  public EventService(EventRepository eventRepository, CrewService crewService, MissionRepository missionRepository) {
    this.eventRepository = eventRepository;
    this.crewService = crewService;
    this.missionRepository = missionRepository;
  }

  public Event update(EventJSON json) {
    if (json.getType().equals(EventType.MISSION)) {
      return crewService.save(json);
    }
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
}
