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

  public Event save(Event event) {
    if (event.getType().equals(EventType.MISSION)) {
      return crewService.save(event);
    }
    return eventRepository.save(event);
  }

  public List<Event> combineCrewsAndEvents(Instant start, Instant end) {
    List<Mission> missions = this.missionRepository.findAllOverlappingDuration(start, end);
    List<Event> events = this.eventRepository.findAllOverlappingDuration(start, end);
    return Stream.concat(
      missions.stream().map(Mission::toAllEvents).flatMap(Collection::stream),
      events.stream()
    ).collect(Collectors.toList());
  }

  public List<Event> combineCrewsAndEvents(Long airmanId, Instant start, Instant end) {
    List<Mission> missions = this.missionRepository.findAllByAirmanIdAndOverlappingDuration(airmanId, start, end);
    List<Event> events = this.eventRepository.findAllByAirmanIdAndOverlappingDuration(airmanId, start, end);
    return Stream.concat(
      missions.stream().map(m -> m.toEvent(airmanId)),
      events.stream()
    ).collect(Collectors.toList());
  }
}
