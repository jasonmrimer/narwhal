package mil.af.us.narwhal.airman;

import mil.af.us.narwhal.qualification.Qualification;
import org.junit.Test;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

public class AirmanTest {
  @Test
  public void addQualification_doesNotDuplicateQuals() throws Exception {
    final Qualification qualification = new Qualification(1L, "A", "A");
    final AirmanQualification airmanQualification = new AirmanQualification(qualification, new Date(), new Date());
    final Airman airman = new Airman();

    assertThat(airman.addQualification(airmanQualification)).isTrue();
    assertThat(airman.getQualifications().size()).isEqualTo(1);

    assertThat(airman.addQualification(airmanQualification)).isFalse();
    assertThat(airman.getQualifications().size()).isEqualTo(1);
  }
}