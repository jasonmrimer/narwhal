package mil.af.us.narwhal.event;

import mil.af.us.narwhal.mission.MissionRepository;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping(EventController.URI)
public class EventController {
  public static final String URI = "/api/events";

  private EventRepository eventRepository;
  private EventService service;
  private MissionRepository missionRepository;

  public EventController(
    EventRepository eventRepository,
    EventService service,
    MissionRepository missionRepository
  ) {
    this.eventRepository = eventRepository;
    this.service = service;
    this.missionRepository = missionRepository;
  }

  @PostMapping
  public Event create(@Valid @RequestBody Event event) {
    return service.save(event);
  }

  @PutMapping(value = "{id}")
  public Event update(@PathVariable Long id, @Valid @RequestBody Event event) {
    if (event.getType() == EventType.MISSION) {
      return service.save(event);
    }
    return eventRepository.save(event);
  }

  @DeleteMapping(value = "/{id}")
  public void delete(@PathVariable Long id) {
    eventRepository.delete(id);
  }

  @GetMapping
  public List<Event> index(
    @RequestParam Instant start,
    @RequestParam Instant end,
    @RequestParam(required = false) Long airmanId
  ) {
    return airmanId == null ?
      service.combineCrewsAndEvents(start, end) :
      service.combineCrewsAndEvents(airmanId, start, end);
  }
}
