package mil.af.us.narwhal.mission;

import generated.Results;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MissionService {
  private MissionRepository missionRepository;
  private MissionClient client;
  private SiteRepository siteRepository;

  public MissionService(MissionRepository repository, MissionClient client, SiteRepository siteRepository) {
    this.missionRepository = repository;
    this.client = client;
    this.siteRepository = siteRepository;
  }

  public void refreshMissions()  {
    List<Results.MissionMetaData> missionMetaData = client.getMissionMetaData();

    List<Mission> missions = missionMetaData
      .stream()
      .map(MissionService.this::mapMetaDataToMission)
      .collect(Collectors.toList());
    missionRepository.save(missions);
  }

  private Mission mapMetaDataToMission(Results.MissionMetaData metaData) {
    final Site site = siteRepository.findOneByName(metaData.getPrimaryorg());


    return new Mission.Builder()
      .missionId(metaData.getMissionid())
      .atoMissionNumber(metaData.getAtomissionnumber())
      .startDateTime(metaData.getStartdttime().toGregorianCalendar().getTime().toInstant())
      .endDateTime(metaData.getEnddttime().toGregorianCalendar().getTime().toInstant())
      .site(site)
      .build();
  }
}
