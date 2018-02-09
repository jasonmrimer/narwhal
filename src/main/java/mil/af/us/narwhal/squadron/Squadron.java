package mil.af.us.narwhal.squadron;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.site.Site;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import static java.util.Collections.emptyList;

@Entity
@Data
@NoArgsConstructor
public class Squadron {
  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne
  @JsonBackReference
  private Site site;

  private String name;

  @OneToMany(mappedBy = "squadron", cascade = CascadeType.ALL)
  @JsonManagedReference
  List<Flight> flights = new ArrayList<>();

  public Squadron(Long id, Site site, String name, List<Flight> flights) {
    this.id = id;
    this.site = site;
    this.name = name;
    this.flights = new ArrayList<>(flights);
  }

  public Squadron(String name) {
    this(null, null, name, emptyList());
  }

  public void addFlight(Flight flight) {
    flight.setSquadron(this);
    this.flights.add(flight);
  }
}
