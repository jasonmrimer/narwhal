package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.qualification.Qualification;
import mil.af.us.narwhal.certification.Certification;
import mil.af.us.narwhal.unit.Unit;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Airman {
  @Id
  @GeneratedValue
  private Long id;

  private String firstName;

  private String lastName;

  @ManyToMany(cascade = CascadeType.ALL)
  @JoinTable(
    name = "join_airman_qualification",
    joinColumns = @JoinColumn(name = "airman_id", referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(name = "qualification_id", referencedColumnName = "id")
  )
  private List<Qualification> qualifications;

  @ManyToMany(cascade = CascadeType.ALL)
  @JoinTable(
    name = "join_airman_certification",
    joinColumns = @JoinColumn(name = "airman_id", referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(name = "certification_id", referencedColumnName = "id")
  )
  private List<Certification> certifications;

  @ManyToOne
  private Unit unit;
}
