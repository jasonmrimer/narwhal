package mil.af.us.narwhal.airman;

import mil.af.us.narwhal.skills.Certification;
import mil.af.us.narwhal.skills.Qualification;
import org.junit.Test;

import java.time.Instant;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

public class AirmanTest {
  @Test
  public void addQualification_doesNotDuplicateQuals() throws Exception {
    final Qualification qualification = new Qualification(1L, "A", "A");
    final AirmanQualification airmanQualification = new AirmanQualification(qualification, Instant.now(), Instant.now());
    final Airman airman = new Airman();

    assertThat(airman.addQualification(airmanQualification)).isTrue();
    assertThat(airman.getQualifications().size()).isEqualTo(1);

    assertThat(airman.addQualification(airmanQualification)).isFalse();
    assertThat(airman.getQualifications().size()).isEqualTo(1);
  }

  @Test
  public void addCertification_doesNotDuplicateCerts() throws Exception {
    final Certification certification = new Certification(1L, "A");
    final AirmanCertification airmanCertification = new AirmanCertification(certification, Instant.now(), Instant.now());
    final Airman airman = new Airman();

    assertThat(airman.addCertification(airmanCertification)).isTrue();
    assertThat(airman.getCertifications().size()).isEqualTo(1);

    assertThat(airman.addCertification(airmanCertification)).isFalse();
    assertThat(airman.getCertifications().size()).isEqualTo(1);
  }
}