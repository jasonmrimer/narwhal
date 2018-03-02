package mil.af.us.narwhal.crew;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.mission.Mission;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Crew {
  @Id
  @GeneratedValue
  private Long id;

  @OneToOne
  @JoinColumn(name = "mission_id", referencedColumnName = "missionId", nullable = false, unique = true)
  @JsonManagedReference
  private Mission mission;

  @OneToMany(mappedBy = "crew", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<CrewPosition> crewPositions = new ArrayList<>();

  public Crew(Mission mission) {
    this.mission = mission;
  }

  public void addCrewPosition(CrewPosition position) {
    position.setCrew(this);
    this.crewPositions.add(position);
  }

  public void updatePosition(Long positionId, String title, boolean critical) {
    this.crewPositions.stream()
      .filter(position -> position.getId().equals(positionId))
      .findFirst()
      .ifPresent(position -> {
        position.setTitle(title);
        position.setCritical(critical);
      });
  }
}
