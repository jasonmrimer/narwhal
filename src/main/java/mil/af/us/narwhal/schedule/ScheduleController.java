package mil.af.us.narwhal.schedule;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(ScheduleController.URI)
public class ScheduleController {
  public static final String URI = "/api/schedules";

  private ScheduleRepository scheduleRepository;

  public ScheduleController(ScheduleRepository scheduleRepository) {
    this.scheduleRepository = scheduleRepository;
  }

  @GetMapping
  public List<Schedule> index() {
    return this.scheduleRepository.findAll();
  }
}
