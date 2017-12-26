package mil.af.us.narwhal.config;

import mil.af.us.narwhal.mission.MissionClient;
import mil.af.us.narwhal.mission.MissionClientStub;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("!cloud")
@Configuration
public class DefaultConfig {
  @Bean
  public MissionClient missionClient() {
    return new MissionClientStub();
  }
}
