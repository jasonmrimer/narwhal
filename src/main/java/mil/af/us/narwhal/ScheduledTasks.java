package mil.af.us.narwhal;

import mil.af.us.narwhal.mission.*;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.w3c.dom.Node;
import unicorn.GetMissionMetaDataResponse;

import javax.xml.transform.dom.DOMSource;
import java.util.List;

@Component
public class ScheduledTasks {

    MissionRepository repository;
    MissionClient missionClient;

    public ScheduledTasks(MissionRepository repository, MissionClient missionClient) {
        this.repository = repository;
        this.missionClient = missionClient;
    }

    @Scheduled(fixedRate = 1000 * 60 * 60)
    public void lookup() {
        GetMissionMetaDataResponse getMissionMetaDataResponse = missionClient.getMissionMetaData();
        Node result = (Node) getMissionMetaDataResponse
                .getGetMissionMetaDataResult()
                .getContent()
                .get(0);

        Jaxb2Marshaller jaxb2Marshaller = new Jaxb2Marshaller();
        jaxb2Marshaller.setClassesToBeBound(Results.class);
        Results results = (Results) jaxb2Marshaller.unmarshal(new DOMSource(result));

        List<MissionMetaData> missionMetaDataList = results.getMissionMetaData();
        for (MissionMetaData missionMetaData : missionMetaDataList) {
            Mission mission = new Mission(missionMetaData.getMissionid(), missionMetaData.getAtomissionnumber());
            repository.save(mission);
        }
    }
}
