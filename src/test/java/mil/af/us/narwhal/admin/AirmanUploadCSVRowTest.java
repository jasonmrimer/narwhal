package mil.af.us.narwhal.admin;

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