package mil.af.us.narwhal.airman;

import mil.af.us.narwhal.schedule.Schedule;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.skill.Certification;
import mil.af.us.narwhal.skill.Qualification;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.in;

@RunWith(MockitoJUnitRunner.class)
public class AirmanTest {
  @Mock private Site site;

  @Test
  public void addQualification_doesNotDuplicateQuals() {
    final Qualification qualification = new Qualification(1L, "A", "A");
    final AirmanQualification airmanQualification = new AirmanQualification(
      qualification,
      Instant.now(),
      Instant.now(),
      Instant.now(),
      Instant.now()
    );
    final Airman airman = new Airman();

    assertThat(airman.addQualification(airmanQualification)).isTrue();
    assertThat(airman.getQualifications().size()).isEqualTo(1);

    assertThat(airman.addQualification(airmanQualification)).isFalse();
    assertThat(airman.getQualifications().size()).isEqualTo(1);
  }

  @Test
  public void addCertification_doesNotDuplicateCerts() {
    final Certification certification = new Certification(1L, "A", site);
    final AirmanCertification airmanCertification = new AirmanCertification(
      certification,
      Instant.now(),
      Instant.now(),
      Instant.now(),
      Instant.now()
    );
    final Airman airman = new Airman();

    assertThat(airman.addCertification(airmanCertification)).isTrue();
    assertThat(airman.getCertifications().size()).isEqualTo(1);

    assertThat(airman.addCertification(airmanCertification)).isFalse();
    assertThat(airman.getCertifications().size()).isEqualTo(1);
  }

  @Test
  public void testAddSchedule() {
    final Schedule schedule = new Schedule();
    final Airman airman = new Airman();

    airman.addSchedule(new AirmanSchedule(schedule, Instant.EPOCH));
    assertThat(airman.getSchedules().size()).isEqualTo(1);

    airman.addSchedule(new AirmanSchedule(schedule, Instant.now()));
    assertThat(airman.getSchedules().size()).isEqualTo(2);

    long count = airman.getSchedules().stream()
      .filter(airmanSchedule -> airmanSchedule.getEndDate() == null)
      .count();

    assertThat(count).isEqualTo(1L);
  }
}