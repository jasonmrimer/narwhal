package mil.af.us.narwhal.mission;

import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MissionService {
  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MM-dd-uuuu'T'HH:mm:ss.sX");

  private MissionRepository repository;
  private MissionClient client;

  public MissionService(MissionRepository repository, MissionClient client) {
    this.repository = repository;
    this.client = client;
  }

  public void refreshMissions() {
    List<Mission> missions = client.getMissionMetaData()
      .stream()
      .map(this::mapMetaDataToMission)
      .collect(Collectors.toList());
    repository.save(missions);
  }

  private Mission mapMetaDataToMission(MissionMetaData metaData) {
    final ZonedDateTime startDateTime = mapStringToZonedDateTime(metaData.getStartdttime());
    final ZonedDateTime endDateTime = mapStringToZonedDateTime(metaData.getEnddttime());
    return Mission.builder()
      .missionId(metaData.getMissionid())
      .atoMissionNumber(metaData.getAtomissionnumber())
      .startDateTime(startDateTime)
      .endDateTime(endDateTime)
      .build();
  }

  private ZonedDateTime mapStringToZonedDateTime(String dateTime) {
    return dateTime.isEmpty() ? null : ZonedDateTime.parse(dateTime, FORMATTER);
  }
}
