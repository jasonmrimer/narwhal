package mil.af.us.narwhal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Profile("storybook")
@Configuration
public class StorybookConfig extends WebMvcConfigurerAdapter{
  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/storybook").setViewName("storybook.html");
  }
}
