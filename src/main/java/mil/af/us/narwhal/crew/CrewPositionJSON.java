package mil.af.us.narwhal.crew;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrewPositionJSON {
  private Long id;
  private String title;
  private boolean critical;
  private Long airmanId;
  private String remarks;
  private Long order;
  private Long templateItemId;
}
