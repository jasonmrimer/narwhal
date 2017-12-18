package mil.af.us.narwhal.airman_qualification;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.qualification.Qualification;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "join_airman_qualification")
@IdClass(AirmanQualificationId.class)
public class AirmanQualification {
  @Id
  @JsonIgnore
  private long airman_id;

  @Id
  @JsonIgnore
  private long qualification_id;

  @Column(name = "expiration_date")
  private Date expirationDate;

  @ManyToOne
  @JoinColumn(name = "qualification_id", updatable = false, insertable = false, referencedColumnName = "id")
  @JsonUnwrapped
  private Qualification qualification;
}
