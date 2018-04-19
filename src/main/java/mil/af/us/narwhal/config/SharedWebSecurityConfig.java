package mil.af.us.narwhal.config;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

public class SharedWebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
      .antMatchers(HttpMethod.GET, "/api/profiles").hasRole("ADMIN")
      .anyRequest()
      .authenticated()
      .and()
      .headers()
      .frameOptions()
      .sameOrigin();
  }
}
