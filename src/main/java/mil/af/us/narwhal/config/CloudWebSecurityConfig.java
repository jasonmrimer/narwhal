package mil.af.us.narwhal.config;

import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

@Profile("cloud")
@Configuration
@EnableOAuth2Sso
public class CloudWebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
      .anyRequest().authenticated()
      .and()
      .csrf()
      .disable();
  }


  @Bean
  PrincipalExtractor principalExtractor() {
    return map -> User.withUsername((String) map.get("user_name")).password("").authorities(Collections.emptyList()).build();
  }
}
