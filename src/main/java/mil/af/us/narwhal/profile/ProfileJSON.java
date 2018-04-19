package mil.af.us.narwhal.profile;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileJSON {
  private Long id;
  private String username;
  private Long siteId;
  private String siteName;
  private String role;
  private boolean classified;
}
