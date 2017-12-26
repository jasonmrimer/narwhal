package mil.af.us.narwhal.mission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.ZonedDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Mission {
  @Id
  private String missionId;
  private String atoMissionNumber;
  private ZonedDateTime startDateTime;
  private ZonedDateTime endDateTime;

  public Mission(String missionId, String atoMissionNumber, ZonedDateTime startDateTime) {
    this.missionId = missionId;
    this.atoMissionNumber = atoMissionNumber;
    this.startDateTime = startDateTime;
  }
}
