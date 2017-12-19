package mil.af.us.narwhal;

import mil.af.us.narwhal.mission.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.w3c.dom.Node;
import unicorn.GetMissionMetaDataResponse;

import javax.xml.transform.dom.DOMSource;
import java.util.List;

@Component
public class TaskRunner {
    @Autowired
    MissionRepository repository;

    @Autowired
    MissionClient missionClient;

    @Scheduled(fixedRate = 1000 * 60 * 60)
    public void lookup() {
        GetMissionMetaDataResponse response = missionClient.getMissionMetaDataResponse();
        Object result = response.getGetMissionMetaDataResult().getContent().get(0);

        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setClassesToBeBound(Results.class);

        Results results = (Results) marshaller.unmarshal(new DOMSource((Node) result));

        List<MissionMetaData> missionMetaDataList = results.getMissionMetaData();
        for (MissionMetaData missionMetaData : missionMetaDataList) {
            Mission mission = new Mission(missionMetaData.getMissionid());
            repository.save(mission);
        }
    }
}
