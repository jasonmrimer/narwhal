package mil.af.us.narwhal.mission;

import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static org.mockito.Mockito.verify;


@RunWith(MockitoJUnitRunner.class)
public class MissionServiceTest {
  public static final ZoneId ZONE_ID = ZoneId.of("Z");

  @Mock private MissionRepository repository;
  @Captor private ArgumentCaptor<List<Mission>> captor;
  private MissionService subject;

  @Test
  public void refreshMissions() {
    subject = new MissionService(repository, new MissionClientStub());
    subject.refreshMissions();

    verify(repository).save(captor.capture());
    Assertions.assertThat(captor.getValue()).containsExactlyInAnyOrder(
      new Mission("1", "A", ZonedDateTime.of(2017, 1, 1, 1, 30, 0, 0, ZONE_ID), ZonedDateTime.of(2017, 1, 1, 11, 30, 0, 0, ZONE_ID)),
      new Mission("2", "B", ZonedDateTime.of(2017, 2, 2, 2, 0, 0, 0, ZONE_ID), ZonedDateTime.of(2017, 2, 2, 14, 0, 0, 0, ZONE_ID)),
      new Mission("3", "C", ZonedDateTime.of(2017, 3, 3, 3, 0, 0, 0, ZONE_ID), null)
    );
  }
}