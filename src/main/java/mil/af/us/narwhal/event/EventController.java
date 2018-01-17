package mil.af.us.narwhal.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(EventController.URI)
public class EventController {
  public static final String URI = "/api/events";

  @Autowired private EventRepository repository;

  @PostMapping
  public ResponseEntity<Event> create(@RequestBody Event event) {
    return new ResponseEntity<>(repository.save(event), HttpStatus.CREATED);
  }
}
