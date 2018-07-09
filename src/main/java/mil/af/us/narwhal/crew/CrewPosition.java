package mil.af.us.narwhal.crew;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.mission.Mission;

import javax.persistence.*;

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

  private String remarks;

  @Column(name = "order_int")
  private Long order;

  @Column(name = "template_item_id")
  private Long templateItemId;

  private Boolean critical;

  public CrewPosition(Airman airman) {
    this.airman = airman;
  }

  public CrewPosition(
    Airman airman,
    String title,
    Boolean critical
  ) {
    this.airman = airman;
    this.title = title;
    this.critical = critical;
  }

  public CrewPosition(
    Airman airman,
    String title,
    Boolean critical,
    Long order,
    Long templateItemId
  ) {
    this.airman = airman;
    this.title = title;
    this.critical = critical;
    this.order = order;
    this.templateItemId = templateItemId;
  }

  public CrewPosition(
    Boolean critical,
    Long order,
    Long templateItemId
  ) {
    this.critical = critical;
    this.order = order;
    this.templateItemId = templateItemId;
  }

  @Override public String toString() {
    return "CrewPosition{" +
      "id=" + id +
      '}';
  }
}
