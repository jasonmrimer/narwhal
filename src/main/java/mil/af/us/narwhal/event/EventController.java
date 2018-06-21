package mil.af.us.narwhal.event;

import com.sun.org.apache.xpath.internal.operations.Bool;
import mil.af.us.narwhal.profile.Profile;
import mil.af.us.narwhal.profile.RoleName;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

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
    if (profile.getRole().getName() == RoleName.READER) {
      json.setStatus(EventStatus.PENDING);
    } else {
      json.setStatus(EventStatus.APPROVED);
    }

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

  @GetMapping("/hasPending")
  public Map<String, Boolean> pendingCount(@AuthenticationPrincipal Profile profile){
    Calendar date = new GregorianCalendar();
    date.set(Calendar.HOUR_OF_DAY, 0);
    date.set(Calendar.MINUTE, 0);
    date.set(Calendar.SECOND, 0);
    date.set(Calendar.MILLISECOND, 0);
    Instant today = date.toInstant();
    Long result = service.pendingEventCountBySiteId(
      profile.getSite().getId(),
      today,
      today.plus(60, ChronoUnit.DAYS)
    );
    final Boolean countIsGreaterThanZero = result > 0;
    return Collections.singletonMap("success", countIsGreaterThanZero);
  }

  @GetMapping("/pending")
  public List<Event> pendingEvents(@AuthenticationPrincipal Profile profile) {
    Calendar date = new GregorianCalendar();
    date.set(Calendar.HOUR_OF_DAY, 0);
    date.set(Calendar.MINUTE, 0);
    date.set(Calendar.SECOND, 0);
    date.set(Calendar.MILLISECOND, 0);
    Instant today = date.toInstant();
    return service.pendingEventsBySiteId(
      profile.getSite().getId(),
      today,
      today.plus(60, ChronoUnit.DAYS)
    );
  }
}
