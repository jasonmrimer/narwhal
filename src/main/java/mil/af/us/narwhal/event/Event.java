package mil.af.us.narwhal.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Event {
  @Id
  @GeneratedValue
  private Long id;

  @NotNull
  private String title;

  private String description;

  @NotNull
  private Instant startTime;

  @NotNull
  private Instant endTime;

  @NotNull
  @Enumerated(EnumType.STRING)
  private EventType type;

  @NotNull
  @Column(name = "airman_id")
  private Long airmanId;

  public Event(
    String title,
    String description,
    Instant startTime,
    Instant endTime,
    EventType eventType,
    Long airmanId
  ) {
    this(null, title, description, startTime, endTime, eventType, airmanId);
  }
}
