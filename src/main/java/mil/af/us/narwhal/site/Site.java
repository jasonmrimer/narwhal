package mil.af.us.narwhal.site;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import mil.af.us.narwhal.squadron.Squadron;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class Site {
  @Id
  private Long id;

  private String name;

  @OneToMany(mappedBy = "siteId")
  @JsonManagedReference
  private List<Squadron> squadrons;

  // Compliant
  public Site() {
    // no-arg constructor
  }

  public Site(Long id, String name, List<Squadron> squadrons) {
    this.id = id;
    this.name = name;
    this.squadrons = squadrons;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<Squadron> getSquadrons() {
    return squadrons;
  }

  public void setSquadrons(List<Squadron> squadrons) {
    this.squadrons = squadrons;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Site site = (Site) o;

    if (id != null ? !id.equals(site.id) : site.id != null) return false;
    if (name != null ? !name.equals(site.name) : site.name != null) return false;
    return squadrons != null ? squadrons.equals(site.squadrons) : site.squadrons == null;
  }

  @Override
  public int hashCode() {
    int result = id != null ? id.hashCode() : 0;
    result = 31 * result + (name != null ? name.hashCode() : 0);
    result = 31 * result + (squadrons != null ? squadrons.hashCode() : 0);
    return result;
  }
}
