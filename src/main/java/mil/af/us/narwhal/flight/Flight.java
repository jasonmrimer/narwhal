package mil.af.us.narwhal.flight;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flight {
  @Id
  @GeneratedValue
  private Long id;

  @Column(name = "squadron_id")
  private Long squadronId;

  private String name;
}
