package mil.af.us.narwhal.airman;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.skills.Certification;
import mil.af.us.narwhal.skills.Qualification;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(MockitoJUnitRunner.class)
public class AirmanTest {
  @Mock private Site site;

  @Test
  public void addQualification_doesNotDuplicateQuals() {
    final Qualification qualification = new Qualification(1L, "A", "A");
    final AirmanQualification airmanQualification = new AirmanQualification(qualification, Instant.now(), Instant.now());
    final Airman airman = new Airman();

    assertThat(airman.addQualification(airmanQualification)).isTrue();
    assertThat(airman.getQualifications().size()).isEqualTo(1);

    assertThat(airman.addQualification(airmanQualification)).isFalse();
    assertThat(airman.getQualifications().size()).isEqualTo(1);
  }

  @Test
  public void addCertification_doesNotDuplicateCerts() {
    final Certification certification = new Certification(1L, "A", site);
    final AirmanCertification airmanCertification = new AirmanCertification(certification, Instant.now(), Instant.now());
    final Airman airman = new Airman();

    assertThat(airman.addCertification(airmanCertification)).isTrue();
    assertThat(airman.getCertifications().size()).isEqualTo(1);

    assertThat(airman.addCertification(airmanCertification)).isFalse();
    assertThat(airman.getCertifications().size()).isEqualTo(1);
  }
}