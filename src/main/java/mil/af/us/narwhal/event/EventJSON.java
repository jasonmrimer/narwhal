package mil.af.us.narwhal.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventJSON {
  private static final String emptyFieldMessage = "This field is required.";

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

  @Enumerated(EnumType.STRING)
  private EventStatus status;

  @NotNull(message = emptyFieldMessage)
  private Long airmanId;

  @AssertTrue(message = "End Date cannot be before Start Date.")
  public boolean isValidDateRange() {
    if (this.endTime != null && this.startTime != null) {
      return this.endTime.compareTo(this.startTime) >= 0;
    } else {
      return true;
    }
  }
}
