package mil.af.us.narwhal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Profile({"!cloud", "storybook"})
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
      .antMatchers("/api/*").hasAnyRole("ADMIN", "WRITER", "READER")
      .anyRequest()
      .authenticated()
      .and()
      .formLogin()
      .and()
      .httpBasic()
      .and()
      .csrf()
      .disable();

    http
      .headers()
      .frameOptions().sameOrigin();
  }
}