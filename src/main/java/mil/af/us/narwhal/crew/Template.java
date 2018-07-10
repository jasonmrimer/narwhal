package mil.af.us.narwhal.crew;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "template")
public class Template {
  @Id
  @GeneratedValue
  private Long id;

  private String title;
}