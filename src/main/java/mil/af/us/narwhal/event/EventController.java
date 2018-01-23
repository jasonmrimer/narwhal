package mil.af.us.narwhal.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(EventController.URI)
public class EventController {
  public static final String URI = "/api/events";

  @Autowired private EventRepository repository;

  @PostMapping
  public ResponseEntity<Event> create(@RequestBody Event event) {
    return new ResponseEntity<>(repository.save(event), HttpStatus.CREATED);
  }

  @PutMapping(value = "{id}")
  public Event update(@PathVariable Long id,  @RequestBody Event event) {
    return repository.save(event);
  }

  @DeleteMapping(value = "{id}")
  public void delete(@PathVariable Long id) {
    repository.delete(id);
  }
}
