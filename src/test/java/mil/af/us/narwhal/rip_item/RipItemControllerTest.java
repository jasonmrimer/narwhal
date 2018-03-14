package mil.af.us.narwhal.rip_item;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class RipItemControllerTest {
  @LocalServerPort private int port;
  @Autowired private RipItemRepository ripItemRepository;

  @Before
  public void setup() {
    RipItem ripItem1 = new RipItem();
    ripItem1.setTitle("Distress Signal");
    RipItem ripItem2 = new RipItem();
    ripItem2.setTitle("NICKLEBACK");
    ripItemRepository.save(ripItem1);
    ripItemRepository.save(ripItem2);
  }

  @Test
  public void indexTest() {
    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
    .when()
      .get(RipItemController.URI)
    .then()
      .statusCode(200)
      .body("$.size()", equalTo(2))
      .body("[0].title", equalTo("Distress Signal"))
      .body("[1].title", equalTo("NICKLEBACK"));
    // @formatter:on
  }
}