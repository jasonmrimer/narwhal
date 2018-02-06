package mil.af.us.narwhal.airman;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.event.Event;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Airman {
  @Id
  @GeneratedValue
  private Long id;

  @Column(name = "flight_id")
  private Long flightId;

  private String firstName;

  private String lastName;

  @OneToMany(mappedBy = "airmanId", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<AirmanQualification> qualifications = new ArrayList<>();

  @OneToMany(mappedBy = "airmanId", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<AirmanCertification> certifications = new ArrayList<>();

  @OneToMany(mappedBy = "airmanId")
  @JsonManagedReference
  private List<Event> events = new ArrayList<>();

  public Airman(Long flightId, String firstName, String lastName) {
    this.flightId = flightId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public Airman(
    Long id,
    Long flightId,
    String firstName,
    String lastName,
    List<AirmanQualification> qualifications,
    List<AirmanCertification> certifications,
    List<Event> events
  ) {
    this.id = id;
    this.flightId = flightId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.qualifications = new ArrayList<>(qualifications);
    this.certifications = new ArrayList<>(certifications);
    this.events = new ArrayList<>(events);
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

  public void updateCertification(AirmanCertification certification) {
    certifications.stream()
      .filter(cert -> cert.getId().equals(certification.getId()))
      .findFirst()
      .ifPresent(cert -> cert.setExpirationDate(certification.getExpirationDate()));
  }

  public void updateQualification(AirmanQualification qualification) {
    qualifications.stream()
      .filter(qual -> qual.getId().equals(qualification.getId()))
      .findFirst()
      .ifPresent(qual -> qual.setExpirationDate(qualification.getExpirationDate()));
  }

  public void deleteQualification(Long id) {
    qualifications.removeIf(qualification -> qualification.getId().equals(id));
  }

  public void deleteCertification(Long id) {
    certifications.removeIf(certification -> certification.getId().equals(id));
  }
}
