package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirmanSkillJSON {
  private Long id;

  @NotNull
  private Long skillId;

  @NotNull
  private Instant earnDate;

  @NotNull
  private Instant expirationDate;

  public AirmanSkillJSON(Long skillId, Instant earnDate, Instant expirationDate) {
    this.skillId = skillId;
    this.earnDate = earnDate;
    this.expirationDate = expirationDate;
  }
}
