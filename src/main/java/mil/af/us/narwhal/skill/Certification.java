package mil.af.us.narwhal.skill;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.airman.AirmanCertification;
import mil.af.us.narwhal.site.Site;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

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

  @OneToMany(mappedBy = "certification", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<AirmanCertification> airmanCertifications = new ArrayList<>();

  public Certification(String title, Site site) {
    this.title = title;
    this.site = site;
  }

  public Certification(String title) {
    this.title = title;
  }

  public Certification(long id, String title, Site site) {
    this.id = id;
    this.title = title;
    this.site = site;
  }

  @JsonProperty
  public Long siteId() {
    return this.site != null
      ? this.site.getId()
      : null;
  }
}
