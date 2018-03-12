package mil.af.us.narwhal.config;

import mil.af.us.narwhal.mission.MissionClient;
import mil.af.us.narwhal.mission.UnicornMissionClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile({"cloud", "prod"})
@Configuration
public class CloudConfig {
  @Bean
  public MissionClient missionClient(@Value("${unicorn-url}") String uri) {
    return new UnicornMissionClient(uri);
  }
}
