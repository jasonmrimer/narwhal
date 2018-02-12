package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.skills.Certification;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
  name = "join_airman_certification",
  uniqueConstraints = {@UniqueConstraint(columnNames = {"airman_id", "certification_id"})}
)
public class AirmanCertification {
  @Id
  @GeneratedValue
  private Long Id;

  @Column(name = "airman_id", nullable = false)
  private Long airmanId;

  @ManyToOne
  @JoinColumn(name = "certification_id", referencedColumnName = "id", nullable = false)
  private Certification certification;

  @NotNull
  @Column(name = "earn_date")
  private Date earnDate;

  @NotNull
  @Column(name = "expiration_date")
  private Date expirationDate;

  public AirmanCertification(Long airmanId, Certification certification, Date earnDate, Date expirationDate) {
    this.airmanId = airmanId;
    this.certification = certification;
    this.earnDate = earnDate;
    this.expirationDate = expirationDate;
  }

  public AirmanCertification(Certification certification, Date earnDate, Date expirationDate) {
    this.certification = certification;
    this.earnDate = earnDate;
    this.expirationDate = expirationDate;
  }
}
