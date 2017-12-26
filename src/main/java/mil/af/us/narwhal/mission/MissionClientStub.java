package mil.af.us.narwhal.mission;

import java.util.List;

import static java.util.Arrays.asList;

public class MissionClientStub implements MissionClient {
  @Override
  public List<MissionMetaData> getMissionMetaData() {
    return asList(
      new MissionMetaData("1", "A", "01-01-2017T01:30:00.0Z", "01-01-2017T11:30:00.0Z"),
      new MissionMetaData("2", "B", "02-02-2017T02:00:00.0Z", "02-02-2017T14:00:00.0Z"),
      new MissionMetaData("3", "C", "03-03-2017T03:00:00.0Z", "")
    );
  }
}


