package mil.af.us.narwhal.mission;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.crew.CrewJSON;
import mil.af.us.narwhal.crew.CrewPosition;
import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.event.EventType;
import mil.af.us.narwhal.site.Site;

import javax.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Mission {
  @Id
  @GeneratedValue
  private Long id;

  @Column(unique = true)
  private String missionId;

  private String atoMissionNumber;

  private Instant startDateTime;

  private Instant endDateTime;

  private String platform;

  @ManyToOne
  @JsonManagedReference
  private Site site;

  @OneToMany(mappedBy = "mission", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<CrewPosition> crewPositions = new ArrayList<>();

  @Column(name = "updated_at")
  private Instant updatedAt;

  public Mission(
    Long id,
    String missionId,
    String atoMissionNumber,
    Instant startDateTime,
    Instant endDateTime,
    String platform,
    Site site,
    Instant updatedAt
  ) {
    this.id = id;
    this.missionId = missionId;
    this.atoMissionNumber = atoMissionNumber;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.platform = platform;
    this.site = site;
    this.updatedAt = updatedAt;
  }

  public Mission(
    String missionId,
    String atoMissionNumber,
    Instant startDateTime,
    Instant endDateTime,
    String platform,
    Site site,
    Instant updatedAt
  ) {
    this.missionId = missionId;
    this.atoMissionNumber = atoMissionNumber;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.platform = platform;
    this.site = site;
    this.updatedAt = updatedAt;
  }

  public void addCrewPosition(CrewPosition position) {
    position.setMission(this);
    this.crewPositions.add(position);
  }

  public void updatePosition(Long positionId, String title, boolean critical) {
    this.crewPositions.stream()
      .filter(position -> position.getId().equals(positionId))
      .findFirst()
      .ifPresent(position -> {
        position.setTitle(title);
        position.setCritical(critical);
      });
  }

  public Event toEvent(Long airmanId) {
    Optional<Airman> optionalAirman = this.crewPositions.stream()
      .map(CrewPosition::getAirman)
      .filter(a -> a.getId().equals(airmanId))
      .findFirst();

    return optionalAirman.map(airman -> new Event(
      this.id,
      this.getAtoMissionNumber(),
      "",
      this.getStartDateTime(),
      this.getEndDateTime(),
      EventType.MISSION,
      airman
    )).orElse(null);
  }

  public List<Event> toAllEvents() {
    return this.crewPositions.stream()
      .map(CrewPosition::getAirman)
      .map(Airman::getId)
      .map(this::toEvent)
      .collect(Collectors.toList());
  }


  public CrewJSON toCrewJSON() {
    return new CrewJSON(id, this, crewPositions);
  }

  @JsonProperty
  public boolean hasCrew() {
    return crewPositions.size() > 0;
  }
}
