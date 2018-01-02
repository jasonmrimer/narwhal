package mil.af.us.narwhal.mission;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles({ "cloud", "test" })
public class UnicornMissionClientTest {
  @Autowired MissionClient subject;

  @Test
  public void getMissionMetaData() {
    assertThat(subject.getMissionMetaData()).containsOnlyOnce(
      new MissionMetaData(
        "70497d73-a7e4-4000-879a-feaf9099bfa1",
        "HGZ3W09",
        "12-12-2017T04:29:00.0Z",
        "12-12-2017T04:29:00.0Z",
        "DGS-1"
        ),
      new MissionMetaData(
        "929e9a89-b8a1-493d-a69c-e0836e719f78",
        "HGZ3W08",
        "12-12-2017T09:00:00.0Z",
        "12-12-2017T12:00:00.0Z",
        "DGS-2"
      ),
      new MissionMetaData(
        "a991c6f9-a5ed-4d76-9719-7231e8da2c98",
        "HGZ3W98",
        "12-21-2017T14:04:00.0Z",
        "12-21-2017T16:00:00.0Z",
        "DGS-1"
      )
    );
  }
}