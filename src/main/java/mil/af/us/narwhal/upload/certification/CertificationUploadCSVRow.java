package mil.af.us.narwhal.upload.certification;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertificationUploadCSVRow {
  @CsvBindByName(required = true) private String title;
  @CsvBindByName(required = true) private String site;
}
