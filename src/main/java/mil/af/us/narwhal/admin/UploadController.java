package mil.af.us.narwhal.admin;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
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

  private AirmanUploadService airmanUploadService;
  private QualificationUploadService qualificationUploadService;

  public UploadController(AirmanUploadService airmanUploadService, QualificationUploadService qualificationUploadService) {
    this.airmanUploadService = airmanUploadService;
    this.qualificationUploadService = qualificationUploadService;
  }

  @PostMapping("/airman")
  @SuppressWarnings("unchecked")
  public String importAirmanCSV(@RequestParam("file") MultipartFile file) throws IOException {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      CsvToBean csvToBean = new CsvToBeanBuilder<AirmanUploadCSVRow>(reader)
        .withType(AirmanUploadCSVRow.class)
        .withIgnoreLeadingWhiteSpace(true)
        .build();
      airmanUploadService.importToDatabase(csvToBean.parse());
      return "redirect:/";
    }
  }

  @PostMapping("/qualification")
  public String importQualificationCSV(@RequestParam("file") MultipartFile file) throws IOException {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      CsvToBean csvToBean = new CsvToBeanBuilder<QualificationUploadCSVRow>(reader)
        .withType(QualificationUploadCSVRow.class)
        .withIgnoreLeadingWhiteSpace(true)
        .build();
      qualificationUploadService.importToDatabase(csvToBean.parse());
      return "redirect:/";
    }
  }
}
