package mil.af.us.narwhal.upload.airman;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.rank.Rank;
import mil.af.us.narwhal.rank.RankRepository;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirmanUploadCSVRow {
  @CsvBindByName(required = true) private String firstName;
  @CsvBindByName(required = true) private String lastName;
  @CsvBindByName(required = true) private String site;
  @CsvBindByName(required = true) private String squadron;
  @CsvBindByName(required = true) private String flight;

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
