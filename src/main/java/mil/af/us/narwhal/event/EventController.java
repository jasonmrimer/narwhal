package mil.af.us.narwhal.event;

import mil.af.us.narwhal.profile.Profile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

  public EventController(EventRepository eventRepository, EventService service) {
    this.eventRepository = eventRepository;
    this.service = service;
  }

  @PostMapping
  public Event create(@Valid @RequestBody EventJSON json, @AuthenticationPrincipal Profile profile) {
    if (json.getType().equals(EventType.APPOINTMENT)) {
      return service.createAppointment(json, profile);
    } else if (json.getType().equals(EventType.LEAVE)) {
      return service.createLeave(json, profile);
    } else {
      return service.createTDYDeployment(json, profile);
    }
  }

  @PutMapping(value = "{id}")
  public Event update(@PathVariable Long id, @Valid @RequestBody EventJSON json) {
    return service.update(json);
  }

  @DeleteMapping(value = "/{id}")
  public void delete(@PathVariable Long id) {
    eventRepository.delete(id);
  }

  @GetMapping
  public List<Event> index(
    @RequestParam Instant start,
    @RequestParam Instant end,
    @RequestParam(required = false) Long siteId,
    @RequestParam(required = false) Long airmanId
  ) {
    return airmanId == null ?
      service.combineCrewsAndEventsBySite(siteId, start, end) :
      service.combineCrewsAndEventsByAirman(airmanId, start, end);
  }
}
