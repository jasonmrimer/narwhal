package mil.af.us.narwhal.admin;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

@Controller
@RequestMapping(UploadController.URI)
public class UploadController {
  public static final String URI = "/api/upload";

  @Autowired private UploadService uploadService;

  @PostMapping
  @SuppressWarnings("unchecked")
  public String importCSV(@RequestParam("file") MultipartFile file) throws IOException {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      CsvToBean csvToBean = new CsvToBeanBuilder<UploadCSVRow>(reader)
        .withType(UploadCSVRow.class)
        .withIgnoreLeadingWhiteSpace(true)
        .build();
      uploadService.importToDatabase(csvToBean.parse());
      return "redirect:/";
    }
  }
}
