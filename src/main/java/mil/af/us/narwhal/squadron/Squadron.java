package mil.af.us.narwhal.squadron;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import mil.af.us.narwhal.flight.Flight;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class Squadron {
  @Id
  private Long id;

  private String name;

  @Column(name = "site_id")
  private Long siteId;

  @OneToMany(mappedBy = "squadronId")
  @JsonManagedReference
  List<Flight> flights;

  // Compliant
  public Squadron() {
    // no-arg contructor
  }

  public Squadron(Long id, Long siteId, String name, List<Flight> flights) {
    this.id = id;
    this.siteId = siteId;
    this.name = name;
    this.flights = flights;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getSiteId() {
    return siteId;
  }

  public void setSiteId(Long siteId) {
    this.siteId = siteId;
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

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Squadron squadron = (Squadron) o;

    if (id != null ? !id.equals(squadron.id) : squadron.id != null) return false;
    if (name != null ? !name.equals(squadron.name) : squadron.name != null) return false;
    if (siteId != null ? !siteId.equals(squadron.siteId) : squadron.siteId != null) return false;
    return flights != null ? flights.equals(squadron.flights) : squadron.flights == null;
  }

  @Override
  public int hashCode() {
    int result = id != null ? id.hashCode() : 0;
    result = 31 * result + (name != null ? name.hashCode() : 0);
    result = 31 * result + (siteId != null ? siteId.hashCode() : 0);
    result = 31 * result + (flights != null ? flights.hashCode() : 0);
    return result;
  }
}
