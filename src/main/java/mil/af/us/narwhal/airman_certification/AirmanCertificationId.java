package mil.af.us.narwhal.airman_certification;

import java.io.Serializable;
import java.util.Objects;

public class AirmanCertificationId implements Serializable {
  private long airman_id;
  private long certification_id;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    AirmanCertificationId that = (AirmanCertificationId) o;
    return airman_id == that.airman_id &&
      certification_id == that.certification_id;
  }

  @Override
  public int hashCode() {

    return Objects.hash(airman_id, certification_id);
  }
}
