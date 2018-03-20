package mil.af.us.narwhal.mission;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.*;
import java.util.List;
import java.util.TimeZone;

import static java.util.TimeZone.getDefault;

@RestController
@RequestMapping(MissionController.URI)
public class MissionController {
  public static final String URI = "/api/missions";

  MissionRepository missionRepository;


  public MissionController(MissionRepository repository) {
    this.missionRepository = repository;
  }

  @GetMapping
  public List<Mission> index() {
    Instant today = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC);
    return missionRepository.findByStartDateTimeGreaterThanEqualOrderByStartDateTime(today);
  }
}