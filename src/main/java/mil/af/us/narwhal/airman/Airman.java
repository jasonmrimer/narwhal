package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.qualification.Qualification;

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
}
