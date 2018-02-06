package mil.af.us.narwhal.upload.airman;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirmanUploadCSVRow {
  @CsvBindByName private String firstName;
  @CsvBindByName private String lastName;
  @CsvBindByName private String site;
  @CsvBindByName private String squadron;
  @CsvBindByName private String flight;

  public String getSite() {
    return site.toUpperCase();
  }

  public String getSquadron() {
    return squadron.toUpperCase();
  }

  public String getFlight() {
    return flight.toUpperCase();
  }
}
