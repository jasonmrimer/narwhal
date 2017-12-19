package mil.af.us.narwhal.mission;

import mil.af.us.narwhal.Application;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "results")
public class Results {
    private List<MissionMetaData> missionMetaData;

    public List<MissionMetaData> getMissionMetaData() {
        return missionMetaData;
    }

    public void setMissionMetaData(List<MissionMetaData> missionMetaData) {
        this.missionMetaData = missionMetaData;
    }
}
