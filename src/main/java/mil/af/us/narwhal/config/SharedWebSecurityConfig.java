package mil.af.us.narwhal.config;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

public class SharedWebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
      .antMatchers(HttpMethod.POST, "/api/airmen").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.PUT, "/api/airmen").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.DELETE, "/api/airmen/*/certifications/*","/api/airmen/*/qualifications/*").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.POST, "/api/airmen/*/certifications","/api/airmen/*/qualifications").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.PUT, "/api/airmen/*/certifications","/api/airmen/*/qualifications").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.PUT, "/api/crews").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.DELETE, "/api/crews/*/airmen/*").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.DELETE, "/api/crew_positions").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.PUT, "/api/crew_positions/*").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.GET, "/api/profiles").hasRole("ADMIN")
      .antMatchers(HttpMethod.PUT, "/api/profiles").hasRole("ADMIN")
      .antMatchers(HttpMethod.PUT, "/api/skill/rip-items").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.POST, "/api/upload/airmen").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.POST, "/api/upload/airmen/certifications").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.POST, "/api/upload/airmen/qualifications").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.POST, "/api/upload/certifications").hasAnyRole("ADMIN", "WRITER")
      .antMatchers(HttpMethod.POST, "/api/upload/qualifications").hasAnyRole("ADMIN", "WRITER")
      .anyRequest()
      .authenticated()
      .and()
      .headers()
      .frameOptions()
      .sameOrigin();
  }
}
