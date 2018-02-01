package mil.af.us.narwhal.airman;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import mil.af.us.narwhal.event.Event;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Airman {
  @Id
  @GeneratedValue
  private Long id;

  @Column(name = "flight_id")
  private Long flightId;

  private String firstName;

  private String lastName;

  @OneToMany(mappedBy = "airmanId", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<AirmanQualification> qualifications = new ArrayList<>();

  @OneToMany(mappedBy = "airmanId")
  @JsonManagedReference
  private List<AirmanCertification> certifications = new ArrayList<>();

  @OneToMany(mappedBy = "airmanId")
  @JsonManagedReference
  List<Event> events = new ArrayList<>();

  public Airman() {
  }

  public Airman(Long id, Long flightId, String firstName, String lastName, List<AirmanQualification> qualifications, List<AirmanCertification> certifications, List<Event> events) {
    this.id = id;
    this.flightId = flightId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.qualifications = new ArrayList<>(qualifications);
    this.certifications = new ArrayList<>(certifications);
    this.events = new ArrayList<>(events);
  }

  public Airman(Long flightId, String firstName, String lastName) {
    this.flightId = flightId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.qualifications = new ArrayList<>();
    this.certifications = new ArrayList<>();
    this.events = new ArrayList<>();
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

  public List<AirmanQualification> getQualifications() {
    return qualifications;
  }

  public void setQualifications(List<AirmanQualification> qualifications) {
    this.qualifications = qualifications;
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
      ", qualifications=" + qualifications +
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
      Objects.equals(qualifications, airman.qualifications) &&
      Objects.equals(certifications, airman.certifications) &&
      Objects.equals(events, airman.events);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, flightId, firstName, lastName, qualifications, certifications, events);
  }

  public boolean addQualification(AirmanQualification airmanQualification) {
    for (AirmanQualification qual : qualifications) {
      if (qual.getQualification().getId().equals(airmanQualification.getQualification().getId())) {
        return false;
      }
    }
    airmanQualification.setAirmanId(this.id);
    qualifications.add(airmanQualification);
    return true;
  }
}
