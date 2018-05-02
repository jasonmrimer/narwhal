package mil.af.us.narwhal.schedule;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
  @Id
  @GeneratedValue
  private Long id;

  @NotNull
  private String type;

  @NotNull
  private boolean sunday;

  @NotNull
  private boolean monday;

  @NotNull
  private boolean tuesday;

  @NotNull
  private boolean wednesday;

  @NotNull
  private boolean thursday;

  @NotNull
  private boolean friday;

  @NotNull
  private boolean saturday;

  public Schedule(String type, boolean sunday, boolean monday, boolean tuesday, boolean wednesday, boolean thursday, boolean friday, boolean saturday) {
    this.type = type;
    this.sunday = sunday;
    this.monday = monday;
    this.tuesday = tuesday;
    this.wednesday = wednesday;
    this.thursday = thursday;
    this.friday = friday;
    this.saturday = saturday;
  }
}
