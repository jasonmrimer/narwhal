package mil.af.us.narwhal.mission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.event.EventType;
import mil.af.us.narwhal.site.Site;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Mission {
  @Id
  private String missionId;

  private String atoMissionNumber;

  private Instant startDateTime;

  private Instant endDateTime;

  @ManyToOne
  private Site site;

  public Event toEvent(Long crewId, Long airmanId) {
    return new Event (
      crewId,
      this.getAtoMissionNumber(),
      "",
      this.getStartDateTime(),
      this.getEndDateTime(),
      EventType.MISSION,
      airmanId
    );
  }
}
