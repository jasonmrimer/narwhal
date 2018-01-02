package mil.af.us.narwhal.mission;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MissionService {
  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MM-dd-uuuu'T'HH:mm:ss.0X");

  private MissionRepository missionRepository;
  private MissionClient client;
  private SiteRepository siteRepository;

  public MissionService(MissionRepository repository, MissionClient client, SiteRepository siteRepository) {
    this.missionRepository = repository;
    this.client = client;
    this.siteRepository = siteRepository;
  }

  public void refreshMissions() {
    List<Mission> missions = client.getMissionMetaData()
      .stream()
      .map(this::mapMetaDataToMission)
      .collect(Collectors.toList());
    missionRepository.save(missions);
  }

  private Mission mapMetaDataToMission(MissionMetaData metaData) {
    final ZonedDateTime startDateTime = mapStringToZonedDateTime(metaData.getStartdttime());
    final ZonedDateTime endDateTime = mapStringToZonedDateTime(metaData.getEnddttime());
    final Site site = siteRepository.findOneByName(metaData.getPrimaryorg());

    return Mission.builder()
      .missionId(metaData.getMissionid())
      .atoMissionNumber(metaData.getAtomissionnumber())
      .startDateTime(startDateTime)
      .endDateTime(endDateTime)
      .site(site)
      .build();
  }

  private ZonedDateTime mapStringToZonedDateTime(String dateTime) {
    return dateTime.isEmpty() ? null : ZonedDateTime.parse(dateTime, FORMATTER);
  }
}
