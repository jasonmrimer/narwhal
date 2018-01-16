package mil.af.us.narwhal.event;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.Instant;

@Entity
public class Event {
  @Id
  private Long id;

  private String title;
  private String description;
  private Instant startTime;
  private Instant endTime;

  @Column(name = "airman_id")
  private Long airmanId;

  public Event(Long id, String title, String description, Instant startTime, Instant endTime, Long airmanId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    this.airmanId = airmanId;
  }

  // Compliant
  public Event() {
    // no-arg constructor
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Instant getStartTime() {
    return startTime;
  }

  public void setStartTime(Instant startTime) {
    this.startTime = startTime;
  }

  public Instant getEndTime() {
    return endTime;
  }

  public void setEndTime(Instant endTime) {
    this.endTime = endTime;
  }

  public Long getAirmanId() {
    return airmanId;
  }

  public void setAirmanId(Long airmanId) {
    this.airmanId = airmanId;
  }
}
