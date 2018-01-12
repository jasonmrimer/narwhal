package mil.af.us.narwhal.squadron;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import mil.af.us.narwhal.flight.Flight;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class Squadron {
  @Id
  private Long id;

  private String name;

  @OneToMany(mappedBy = "squadronId")
  @JsonManagedReference
  List<Flight> flights;

  public Squadron(Long id, String name, List<Flight> flights) {
    this.id = id;
    this.name = name;
    this.flights = flights;
  }

  public Squadron() {
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

  public List<Flight> getFlights() {
    return flights;
  }

  public void setFlights(List<Flight> flights) {
    this.flights = flights;
  }
}
