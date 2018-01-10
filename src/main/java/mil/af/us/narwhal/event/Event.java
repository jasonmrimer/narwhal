package mil.af.us.narwhal.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
  @Id
  private Long id;

  private String title;
  private String description;
  private Instant startTime;
  private Instant endTime;


  @Column(name = "airman_id")
  private Long airmanId;
}
