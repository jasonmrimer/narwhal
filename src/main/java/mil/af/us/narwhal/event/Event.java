package mil.af.us.narwhal.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Event {
  private static final String emptyFieldMessage = "This field is required.";

  @Id
  @GeneratedValue
  private Long id;

  @NotEmpty(message = emptyFieldMessage)
  private String title;

  private String description;

  @NotNull(message = emptyFieldMessage)
  private Instant startTime;

  @NotNull(message = emptyFieldMessage)
  private Instant endTime;

  @NotNull(message = emptyFieldMessage)
  @Enumerated(EnumType.STRING)
  private EventType type;

  @NotNull(message = emptyFieldMessage)
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

  @AssertTrue(message = "End Date cannot be before Start Date.")
  public boolean isValidDateRange() {
    if (this.endTime != null && this.startTime != null) {
      return this.endTime.compareTo(this.startTime) >= 0;
    } else {
      return true;
    }
  }
}
