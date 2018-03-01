package mil.af.us.narwhal.upload.airman;

import mil.af.us.narwhal.upload.airman.AirmanUploadCSVRow;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class AirmanUploadCSVRowTest {
  @Test
  public void upcasesRowText() {
    AirmanUploadCSVRow row = new AirmanUploadCSVRow("first", "last", "site", "squadron", "flight");
    assertThat(row.getSite()).isEqualTo("SITE");
    assertThat(row.getSquadron()).isEqualTo("SQUADRON");
    assertThat(row.getFlight()).isEqualTo("FLIGHT");
  }
}