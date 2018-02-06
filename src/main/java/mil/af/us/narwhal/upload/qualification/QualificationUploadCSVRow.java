package mil.af.us.narwhal.upload.qualification;

import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QualificationUploadCSVRow {
  @CsvBindByName private String title;
  @CsvBindByName private String acronym;
}
