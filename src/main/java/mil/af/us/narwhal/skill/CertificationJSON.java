package mil.af.us.narwhal.skill;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.validator.constraints.NotEmpty;

@Data
@AllArgsConstructor
public class CertificationJSON {
  private static final String emptyFieldMessage = "This field is required.";

  @NotEmpty(message = emptyFieldMessage)
  private String title;
}
