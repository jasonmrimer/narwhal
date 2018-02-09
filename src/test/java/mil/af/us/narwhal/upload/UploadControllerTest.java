package mil.af.us.narwhal.upload;

import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import mil.af.us.narwhal.upload.airman.AirmanUploadCSVRow;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class UploadControllerTest {
  @LocalServerPort private int port;
  @Autowired private SiteRepository siteRepository;
  @Autowired private AirmanRepository airmanRepository;

  @Before
  public void setUp() {
    final Flight flight = new Flight("FLIGHT");

    final Squadron squad = new Squadron("SQUADRON");
    squad.addFlight(flight);

    final Site site = new Site("SITE");
    site.addSquadron(squad);

    siteRepository.save(site);
  }

  @Test
  public void testImportAirmanCSV() throws IOException {
    final File file = File.createTempFile("test", "csv");
    try (final FileOutputStream stream = new FileOutputStream(file)) {
      stream.write("lastName,firstName,site,squadron,flight\nLast,First,SITE,SQUADRON,FLIGHT".getBytes());
    }

    final long count = airmanRepository.count();

    // @formatter:off
    given()
      .port(port)
      .auth()
      .preemptive()
      .basic("tytus", "password")
      .multiPart(file)
    .when()
      .post(UploadController.URI + "/airman")
    .then()
      .statusCode(302);
    // @formatter:on

    assertThat(airmanRepository.count()).isEqualTo(count + 1);
  }
}