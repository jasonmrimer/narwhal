package mil.af.us.narwhal.skill;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CertificationJSON {
  private Long id;
  private String title;
  private Long siteId;
}
