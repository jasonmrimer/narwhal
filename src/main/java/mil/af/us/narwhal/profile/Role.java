package mil.af.us.narwhal.profile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonProperty;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Role {
  @Id
  @GeneratedValue
  private Long id;

  @JsonIgnore
  @Column(nullable = false, unique = true)
  @Enumerated(EnumType.STRING)
  private RoleName name;

  public Role(RoleName name) {
    this.name = name;
  }

  public String getName() {
    return "ROLE_" + name.name();
  }

  @JsonProperty("name")
  public String getShortName() {
    return name.name();
  }
}
