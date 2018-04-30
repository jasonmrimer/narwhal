package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.schedule.Schedule;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "join_airman_schedule")
public class AirmanSchedule {
  @Id
  @GeneratedValue
  private Long id;

  @Column(name = "airman_id", nullable = false)
  private Long airmanId;

  @ManyToOne
  @JoinColumn(name = "schedule_id", referencedColumnName = "id", nullable = false)
  private Schedule schedule;

  @NotNull
  @Column(name = "start_date")
  private Instant startDate;

  @Column(name = "end_date")
  private Instant endDate;

  public AirmanSchedule(Long airmanId, Schedule schedule, Instant startDate) {
    this.airmanId = airmanId;
    this.schedule = schedule;
    this.startDate = startDate;
  }
}

