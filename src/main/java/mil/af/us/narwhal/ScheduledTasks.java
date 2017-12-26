package mil.af.us.narwhal;

import mil.af.us.narwhal.mission.MissionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {
  private MissionService missionService;

  public ScheduledTasks(MissionService missionService) {
    this.missionService = missionService;
  }

  @Scheduled(fixedRate = 1000 * 60 * 60)
  public void lookup() {
    missionService.refreshMissions();
  }
}
