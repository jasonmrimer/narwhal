package mil.af.us.narwhal.profile;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileJSON {
  Profile profile;
  Boolean classified;
}
