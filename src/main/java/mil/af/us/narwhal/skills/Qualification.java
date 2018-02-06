package mil.af.us.narwhal.skills;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Qualification {
  @Id
  @GeneratedValue
  private Long id;

  private String acronym;

  private String title;
}
