package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirmanSkillJSON {
  private static final String emptyFieldMessage = "This field is required.";

  private Long id;

  @NotNull
  private Long skillId;

  @NotNull(message = emptyFieldMessage)
  private Instant earnDate;

  @NotNull(message = emptyFieldMessage)
  private Instant expirationDate;

  public AirmanSkillJSON(Long skillId, Instant earnDate, Instant expirationDate) {
    this.skillId = skillId;
    this.earnDate = earnDate;
    this.expirationDate = expirationDate;
  }

  @AssertTrue(message = "End Date cannot be before Start Date.")
  public boolean isValidDateRange() {
    if (this.expirationDate != null && this.earnDate != null) {
      return this.expirationDate.compareTo(this.earnDate) >= 0;
    } else {
      return true;
    }
  }
}
