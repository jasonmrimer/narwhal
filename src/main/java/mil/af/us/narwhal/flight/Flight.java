package mil.af.us.narwhal.flight;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Flight {
  @Id
  private Long id;

  @Column(name = "squadron_id")
  private Long squadronId;

  private String name;

  public Flight(Long id, Long squadronId, String name) {
    this.id = id;
    this.squadronId = squadronId;
    this.name = name;
  }

  public Flight() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getSquadronId() {
    return squadronId;
  }

  public void setSquadronId(Long squadronId) {
    this.squadronId = squadronId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Flight(Long squadronId, String name) {

    this.squadronId = squadronId;
    this.name = name;
  }
}
