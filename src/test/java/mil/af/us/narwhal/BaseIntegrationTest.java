package mil.af.us.narwhal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Map;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseIntegrationTest {
  protected final static ObjectMapper objectMapper = new ObjectMapper();
  protected final static JavaTimeModule module = new JavaTimeModule();

  static {
    objectMapper.registerModule(module);
  }

  @Autowired private JdbcTemplate template;
  @LocalServerPort protected int port;

  public void tearDown() {
    template.execute("SET REFERENTIAL_INTEGRITY FALSE");
    for (Map result : template.queryForList("SHOW TABLES")) {
      template.execute("TRUNCATE TABLE " + result.get("TABLE_NAME"));
    }
    template.execute("SET REFERENTIAL_INTEGRITY TRUE");
  }
}
