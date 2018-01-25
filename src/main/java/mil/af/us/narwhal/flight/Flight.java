package mil.af.us.narwhal.flight;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Flight {
  @Id
  @GeneratedValue
  private Long id;

  private String name;

  @Column(name = "squadron_id")
  private Long squadronId;

  // Compliant
  public Flight() {
    // no-arg constructor
  }

  public Flight(Long id, Long squadronId, String name) {
    this.id = id;
    this.squadronId = squadronId;
    this.name = name;
  }

  public Flight(Long squadronId, String name) {
    this.name = name;
    this.squadronId = squadronId;
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

  public Long getSquadronId() {
    return squadronId;
  }

  public void setSquadronId(Long squadronId) {
    this.squadronId = squadronId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Flight flight = (Flight) o;

    if (id != null ? !id.equals(flight.id) : flight.id != null) return false;
    if (name != null ? !name.equals(flight.name) : flight.name != null) return false;
    return squadronId != null ? squadronId.equals(flight.squadronId) : flight.squadronId == null;
  }

  @Override
  public int hashCode() {
    int result = id != null ? id.hashCode() : 0;
    result = 31 * result + (name != null ? name.hashCode() : 0);
    result = 31 * result + (squadronId != null ? squadronId.hashCode() : 0);
    return result;
  }
}
