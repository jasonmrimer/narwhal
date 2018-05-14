package mil.af.us.narwhal.event;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.profile.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.nio.file.attribute.UserPrincipal;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping(EventController.URI)
public class EventController {
  public static final String URI = "/api/events";

  private EventRepository eventRepository;
  private AirmanRepository airmanRepository;
  private EventService service;

  public EventController(EventRepository eventRepository, AirmanRepository airmanRepository, EventService service) {
    this.eventRepository = eventRepository;
    this.airmanRepository = airmanRepository;
    this.service = service;
  }

  @PostMapping
  public Event create(@Valid @RequestBody EventJSON json, @AuthenticationPrincipal Profile profile) {
    final Airman airman = airmanRepository.findOne(json.getAirmanId());
    final Event event = Event.fromJSON(json, airman);

    event.setCreatedBy(profile.getUsername());
    event.setCreatedOn(Instant.now());

    return eventRepository.save(event);
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
