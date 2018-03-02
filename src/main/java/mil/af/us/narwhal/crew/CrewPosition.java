package mil.af.us.narwhal.crew;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.airman.Airman;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
  name = "join_crew_airman",
  uniqueConstraints = {@UniqueConstraint(columnNames = {"crew_id", "airman_id"})}
)
public class CrewPosition {
  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne
  @JoinColumn(name = "crew_id", referencedColumnName = "id", nullable = false)
  @JsonBackReference
  private Crew crew;

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

  public CrewPosition(Crew crew, Airman airman) {
    this(null, crew, airman, "", false);
  }

  @Override public String toString() {
    return "CrewPosition{" +
      "id=" + id +
      '}';
  }
}
