package mil.af.us.narwhal.event;

import mil.af.us.narwhal.crew.CrewPositionRepository;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(EventController.URI)
public class EventController {
  public static final String URI = "/api/events";

  private EventRepository eventRepository;
  private CrewPositionRepository crewPositionRepository;
  private EventService service;

  public EventController(
    EventRepository eventRepository,
    CrewPositionRepository crewPositionRepository,
    EventService service
  ) {
    this.eventRepository = eventRepository;
    this.crewPositionRepository = crewPositionRepository;
    this.service = service;
  }

  @PostMapping
  public Event create(@Valid @RequestBody Event event) {
    return service.save(event);
  }

  @PutMapping(value = "{id}")
  public Event update(@PathVariable Long id, @Valid @RequestBody Event event) {
    if (event.getType() == EventType.MISSION) {
      return event;
    }
    return eventRepository.save(event);
  }

  @DeleteMapping(value = "{id}")
  public void delete(@PathVariable Long id, @RequestBody Event event) {
    if (event.getType() == EventType.MISSION) {
      crewPositionRepository.deleteOneByCrewIdAndAirmanId(event.getId(), event.getAirmanId());
    } else {
      eventRepository.delete(id);
    }
  }
}
