package mil.af.us.narwhal.upload.certification;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificationUploadCSVRow {
  @CsvBindByName private String title;
  @CsvBindByName private String site;
}
