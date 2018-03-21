package mil.af.us.narwhal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.filter.AbstractRequestLoggingFilter;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class Application {
  @PostConstruct
  void started() {
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
  }

  @Bean
  AbstractRequestLoggingFilter abstractRequestLoggingFilter() {
    return new CommonsRequestLoggingFilter();
  }

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
