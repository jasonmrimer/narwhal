package mil.af.us.narwhal.crew;

import lombok.AllArgsConstructor;
import lombok.Data;
import mil.af.us.narwhal.mission.Mission;

import java.util.List;

@Data
@AllArgsConstructor
public class CrewJSON {
  private Long id;
  private Mission mission;
  private List<CrewPosition> crewPositions;
}
