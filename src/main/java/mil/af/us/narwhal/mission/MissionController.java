package mil.af.us.narwhal.mission;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping(MissionController.URI)
public class MissionController {
  public static final String URI = "/api/missions";

  MissionRepository missionRepository;

  public MissionController(MissionRepository missionRepository) {
    this.missionRepository = missionRepository;
  }

  @GetMapping
  public List<Mission> index() {
    Instant time = Instant.now().minus(1, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);
    return missionRepository.findByStartDateTimeGreaterThanEqualOrderByStartDateTime(time);
  }

  @GetMapping(path = "/platforms")
  public List<String> findPlatforms(
    @RequestParam Instant startDateTime,
    @RequestParam Instant endDateTime,
    @RequestParam(required = false) Long siteId
  ) {
    return siteId == null ?
      missionRepository.findAllPlatformsByOverlappingDuration(startDateTime, endDateTime) :
      missionRepository.findPlatformsBySiteIdAndOverlappingDuration(siteId, startDateTime, endDateTime);
  }
}