package mil.af.us.narwhal.upload.airman;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttachCertificationCSVRow {
  @CsvBindByName private String firstName;
  @CsvBindByName private String lastName;
  @CsvBindByName private String certificationName;
  @CsvBindByName private String earnDate;
  @CsvBindByName private String expirationDate;
}
