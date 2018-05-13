package mil.af.us.narwhal.flight;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.squadron.Squadron;

import javax.persistence.*;
import java.util.List;

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

	@OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JsonManagedReference
	private List<Airman> airmen;

	private String name;

  public Flight(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return "Flight{" +
      "id=" + id +
      ", squadron=" + squadron.getId() +
      ", name='" + name + '\'' +
      '}';
  }
}
