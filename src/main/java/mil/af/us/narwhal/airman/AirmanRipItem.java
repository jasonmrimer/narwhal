package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.rip_item.RipItem;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
  name = "join_airman_rip_item",
  uniqueConstraints = {@UniqueConstraint(columnNames = {"airman_id", "rip_item_id"})}
)
public class AirmanRipItem {
  @Id
  @GeneratedValue
  private Long Id;

  @Column(name = "airman_id", nullable = false)
  private Long airmanId;

  @ManyToOne
  @JoinColumn(name = "rip_item_id", referencedColumnName = "id", nullable = false)
  private RipItem ripItem;

  private Instant expirationDate;
}
