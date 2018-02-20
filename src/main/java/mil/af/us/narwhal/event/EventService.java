package mil.af.us.narwhal.event;

import mil.af.us.narwhal.crew.CrewService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
  private EventRepository eventRepository;
  private CrewService crewService;

  public EventService(EventRepository eventRepository, CrewService crewService) {
    this.eventRepository = eventRepository;
    this.crewService = crewService;
  }

  public Event save(Event event) {
    if (event.getType().equals(EventType.MISSION)) {
      return crewService.save(event);
    }
    return eventRepository.save(event);
  }
}
