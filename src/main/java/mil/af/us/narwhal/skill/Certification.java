package mil.af.us.narwhal.skill;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.site.Site;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
  @Id
  @GeneratedValue
  private Long id;

  @NotEmpty(message = "This field must not be blank.")
  private String title;

  @NotNull
  @ManyToOne
  @JsonIgnore
  private Site site;

  public Certification(String title, Site site) {
    this.title = title;
    this.site = site;
  }

  @JsonProperty
  public Long siteId() {
    return this.site.getId();
  }
}
