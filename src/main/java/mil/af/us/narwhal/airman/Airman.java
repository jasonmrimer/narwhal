package mil.af.us.narwhal.airman;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.crew.CrewPosition;
import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.flight.Flight;

import javax.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@Data
@NoArgsConstructor
@EntityListeners(AttachAirmanRipItemsListener.class)
public class Airman {
  @Id
  @GeneratedValue
  private Long id;

  private String firstName;

  private String lastName;

  @JsonIgnore
  @ManyToOne(optional = false)
  private Flight flight;

  @Enumerated(EnumType.STRING)
  private ShiftType shift;

  @OneToMany(mappedBy = "airmanId", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<AirmanQualification> qualifications = new ArrayList<>();

  @OneToMany(mappedBy = "airmanId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  @JsonManagedReference
  private List<AirmanCertification> certifications = new ArrayList<>();

  @OneToMany(mappedBy = "airmanId")
  @JsonIgnore
  private List<Event> events = new ArrayList<>();

  @OneToMany(mappedBy = "airman")
  @JsonBackReference
  private List<CrewPosition> crewPositions = new ArrayList<>();

  @OneToMany(mappedBy = "airman", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<AirmanRipItem> ripItems = new ArrayList<>();

  public Airman(Flight flight, String firstName, String lastName) {
    this.flight = flight;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public Long getFlightId() {
    return flight.getId();
  }

  public Long getSquadronId() {
    return flight.getSquadron().getId();
  }

  public Long getSiteId() {
    return flight.getSquadron().getSite().getId();
  }

  @JsonProperty("events")
  public List<Event> getEvents() {
    return Stream.concat(
      this.crewPositions.stream()
        .map(CrewPosition::getMission)
        .map(mission -> mission.toEvent(this.getId())),
      this.events.stream()
    ).collect(Collectors.toList());
  }

  public boolean addRipItem(AirmanRipItem airmanRipItem) {
    for (AirmanRipItem rip : ripItems) {
      if (rip.getRipItem().getId().equals(airmanRipItem.getRipItem().getId())) {
        return false;
      }
    }
    airmanRipItem.setAirman(this);
    ripItems.add(airmanRipItem);
    return true;
  }

  public AirmanRipItem updateRipItem(long id, Instant expirationDate) {
    final Optional<AirmanRipItem> optional = ripItems.stream()
      .filter(ripItem -> ripItem.getId().equals(id))
      .findFirst();
    if (optional.isPresent()) {
      final AirmanRipItem airmanRipItem = optional.get();
      airmanRipItem.setExpirationDate(expirationDate);
      return airmanRipItem;
    }
    return null;
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

  public boolean addCertification(AirmanCertification airmanCertification) {
    for (AirmanCertification cert : certifications) {
      if (cert.getCertification().getId().equals(airmanCertification.getCertification().getId())) {
        return false;
      }
    }
    airmanCertification.setAirmanId(this.id);
    certifications.add(airmanCertification);
    return true;
  }

  public void updateCertification(long id, Instant expirationDate) {
    certifications.stream()
      .filter(cert -> cert.getId().equals(id))
      .findFirst()
      .ifPresent(cert -> cert.setExpirationDate(expirationDate));
  }

  public void updateQualification(long id, Instant expirationDate) {
    qualifications.stream()
      .filter(qual -> qual.getId().equals(id))
      .findFirst()
      .ifPresent(qual -> qual.setExpirationDate(expirationDate));
  }

  public void deleteQualification(Long id) {
    qualifications.removeIf(qualification -> qualification.getId().equals(id));
  }

  public void deleteCertification(Long id) {
    certifications.removeIf(certification -> certification.getId().equals(id));
  }
}
