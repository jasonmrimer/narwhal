package mil.af.us.narwhal.squadron;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.flight.Flight;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Squadron {
  @Id
  private Long id;

  @Column(name = "site_id")
  private Long siteId;

  private String name;

  @OneToMany(mappedBy = "squadronId")
  @JsonManagedReference
  List<Flight> flights = new ArrayList<>();

  public Squadron(Long id, Long siteId, String name) {
    this.id = id;
    this.siteId = siteId;
    this.name = name;
  }

  public Squadron(Long id, Long siteId, String name, List<Flight> flights) {
    this.id = id;
    this.siteId = siteId;
    this.name = name;
    this.flights = new ArrayList<>(flights);
  }

  public void addFlight(Flight flight) {
    flight.setSquadronId(this.id);
    this.flights.add(flight);
  }
}
