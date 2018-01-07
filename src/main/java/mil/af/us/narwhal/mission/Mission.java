package mil.af.us.narwhal.mission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.site.Site;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.Instant;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Mission {
  @Id
  private String missionId;

  private String atoMissionNumber;
  private Instant startDateTime;
  private Instant endDateTime;

  @ManyToOne
  private Site site;

  public Mission(
    String missionId,
    String atoMissionNumber,
    Instant startDateTime,
    Site site) {
      this.missionId = missionId;
      this.atoMissionNumber = atoMissionNumber;
      this.startDateTime = startDateTime;
      this.site = site;
  }
}
