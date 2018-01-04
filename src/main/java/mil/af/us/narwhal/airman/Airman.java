package mil.af.us.narwhal.airman;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.crew.Crew;
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

  @OneToMany(mappedBy = "airmanId")
  @JsonManagedReference
  @JsonProperty("qualifications")
  private List<AirmanQualification> airmanQualifications;

  @OneToMany(mappedBy = "airmanId")
  @JsonManagedReference
  @JsonProperty("certifications")
  private List<AirmanCertification> certifications;

  @ManyToOne
  private Unit unit;

  @ManyToMany
  @JoinTable(name = "join_airman_crew", joinColumns = @JoinColumn(name = "airman_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "crew_id", referencedColumnName = "id"))
  private List<Crew> crew;
}
