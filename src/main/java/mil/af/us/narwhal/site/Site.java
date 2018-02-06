package mil.af.us.narwhal.site;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.squadron.Squadron;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Site {
  @Id
  private Long id;

  private String name;

  @OneToMany(mappedBy = "siteId")
  @JsonManagedReference
  private List<Squadron> squadrons = new ArrayList<>();

  public Site(Long id, String name, List<Squadron> squadrons) {
    this.id = id;
    this.name = name;
    this.squadrons = new ArrayList<>(squadrons);
  }
}
