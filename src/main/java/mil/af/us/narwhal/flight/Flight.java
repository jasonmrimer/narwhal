package mil.af.us.narwhal.flight;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.squadron.Squadron;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Flight {
  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne
  @JsonBackReference
  private Squadron squadron;

  private String name;

  public Flight(String name) {
    this.name = name;
  }
}
