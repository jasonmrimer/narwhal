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
  private Long roleId;
  private String roleName;
  private boolean classified;
}
