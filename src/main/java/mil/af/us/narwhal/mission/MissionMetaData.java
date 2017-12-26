package mil.af.us.narwhal.mission;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MissionMetaData {
  private String missionid;
  private String atomissionnumber;
  private String startdttime;
  private String enddttime;
}
