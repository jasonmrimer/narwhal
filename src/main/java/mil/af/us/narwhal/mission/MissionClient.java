package mil.af.us.narwhal.mission;

import generated.Results;

import java.util.List;

public interface MissionClient {
  List<Results.MissionMetaData> getMissionMetaData();
}
