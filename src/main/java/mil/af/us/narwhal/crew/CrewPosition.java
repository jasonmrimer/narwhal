package mil.af.us.narwhal.crew;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.mission.Mission;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
  name = "join_mission_airman",
  uniqueConstraints = {@UniqueConstraint(columnNames = {"mission_id", "airman_id"})}
)
public class CrewPosition {
  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne
  @JoinColumn(name = "mission_id", referencedColumnName = "id", nullable = false)
  @JsonBackReference
  private Mission mission;

  @ManyToOne
  @JoinColumn(name = "airman_id", referencedColumnName = "id", nullable = false)
  @JsonManagedReference
  private Airman airman;

  private String title;

  private Boolean critical;

  public CrewPosition(Airman airman) {
    this.airman = airman;
  }

  public CrewPosition(Airman airman, String title, Boolean critical) {
    this.airman = airman;
    this.title = title;
    this.critical = critical;
  }

  @Override public String toString() {
    return "CrewPosition{" +
      "id=" + id +
      '}';
  }
}
