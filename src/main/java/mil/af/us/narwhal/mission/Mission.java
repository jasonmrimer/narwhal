package mil.af.us.narwhal.mission;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

  @ManyToOne
  @JsonManagedReference
  private Site site;

  @OneToMany(mappedBy = "mission", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<CrewPosition> crewPositions = new ArrayList<>();

  public Mission(
    Long id,
    String missionId,
    String atoMissionNumber,
    Instant startDateTime,
    Instant endDateTime,
    Site site
  ) {
    this.id = id;
    this.missionId = missionId;
    this.atoMissionNumber = atoMissionNumber;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.site = site;
  }

  public Mission(
    String missionId,
    String atoMissionNumber,
    Instant startDateTime,
    Instant endDateTime,
    Site site
  ) {
    this.missionId = missionId;
    this.atoMissionNumber = atoMissionNumber;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.site = site;
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
    return new Event(
      this.id,
      this.getAtoMissionNumber(),
      "",
      this.getStartDateTime(),
      this.getEndDateTime(),
      EventType.MISSION,
      airmanId
    );
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
}
