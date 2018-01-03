package mil.af.us.narwhal.airman_qualification;

import java.io.Serializable;
import java.util.Objects;

public class AirmanQualificationId implements Serializable {
  private long airmanId;
  private long qualificationId;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    AirmanQualificationId that = (AirmanQualificationId) o;
    return airmanId == that.airmanId &&
      qualificationId == that.qualificationId;
  }

  @Override
  public int hashCode() {
    return Objects.hash(airmanId, qualificationId);
  }
}
