package mil.af.us.narwhal.skills;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.site.Site;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
  @Id
  @GeneratedValue
  private Long id;

  @NotNull
  private String title;

  @NotNull
  @ManyToOne
  @JsonIgnore
  private Site site;

  public Certification(String title, Site site) {
    this.title = title;
    this.site = site;
  }
}
