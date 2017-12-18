package mil.af.us.narwhal.airman_qualification;

import java.io.Serializable;
import java.util.Objects;

public class AirmanQualificationId implements Serializable {
  private long airman_id;
  private long qualification_id;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    AirmanQualificationId that = (AirmanQualificationId) o;
    return airman_id == that.airman_id &&
      qualification_id == that.qualification_id;
  }

  @Override
  public int hashCode() {
    return Objects.hash(airman_id, qualification_id);
  }
}
