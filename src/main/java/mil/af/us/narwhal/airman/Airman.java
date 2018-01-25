package mil.af.us.narwhal.airman;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import mil.af.us.narwhal.event.Event;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

import static java.util.Collections.emptyList;

@Entity
public class Airman {
  @Id
  @GeneratedValue
  private Long id;

  @Column(name = "flight_id")
  private Long flightId;

  private String firstName;

  private String lastName;

  @OneToMany(mappedBy = "airmanId")
  @JsonManagedReference
  @JsonProperty("qualifications")
  private List<AirmanQualification> airmanQualifications;

  @OneToMany(mappedBy = "airmanId")
  @JsonManagedReference
  @JsonProperty("certifications")
  private List<AirmanCertification> certifications;

  @OneToMany(mappedBy = "airmanId")
  @JsonManagedReference
  List<Event> events;

  public Airman() {
  }

  public Airman(Long id, Long flightId, String firstName, String lastName, List<AirmanQualification> airmanQualifications, List<AirmanCertification> certifications, List<Event> events) {
    this.id = id;
    this.flightId = flightId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.airmanQualifications = airmanQualifications;
    this.certifications = certifications;
    this.events = events;
  }

  public Airman(Long flightId, String firstName, String lastName, List<AirmanQualification> airmanQualifications, List<AirmanCertification> certifications, List<Event> events) {
    this.flightId = flightId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.airmanQualifications = airmanQualifications;
    this.certifications = certifications;
    this.events = events;
  }

  public Airman(Long flightId, String firstName, String lastName) {
    this.flightId = flightId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.airmanQualifications = emptyList();
    this.certifications = emptyList();
    this.events = emptyList();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getFlightId() {
    return flightId;
  }

  public void setFlightId(Long flightId) {
    this.flightId = flightId;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public List<AirmanQualification> getAirmanQualifications() {
    return airmanQualifications;
  }

  public void setAirmanQualifications(List<AirmanQualification> airmanQualifications) {
    this.airmanQualifications = airmanQualifications;
  }

  public List<AirmanCertification> getCertifications() {
    return certifications;
  }

  public void setCertifications(List<AirmanCertification> certifications) {
    this.certifications = certifications;
  }

  public List<Event> getEvents() {
    return events;
  }

  public void setEvents(List<Event> events) {
    this.events = events;
  }

  @Override
  public String toString() {
    return "Airman{" +
      "id=" + id +
      ", flightId=" + flightId +
      ", firstName='" + firstName + '\'' +
      ", lastName='" + lastName + '\'' +
      ", airmanQualifications=" + airmanQualifications +
      ", certifications=" + certifications +
      ", events=" + events +
      '}';
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Airman airman = (Airman) o;
    return Objects.equals(id, airman.id) &&
      Objects.equals(flightId, airman.flightId) &&
      Objects.equals(firstName, airman.firstName) &&
      Objects.equals(lastName, airman.lastName) &&
      Objects.equals(airmanQualifications, airman.airmanQualifications) &&
      Objects.equals(certifications, airman.certifications) &&
      Objects.equals(events, airman.events);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, flightId, firstName, lastName, airmanQualifications, certifications, events);
  }
}
