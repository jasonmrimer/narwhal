package mil.af.us.narwhal.upload;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import mil.af.us.narwhal.upload.airman.AirmanUploadCSVRow;
import mil.af.us.narwhal.upload.airman.AirmanUploadService;
import mil.af.us.narwhal.upload.airman.AttachCertificationCSVRow;
import mil.af.us.narwhal.upload.certification.CertificationUploadCSVRow;
import mil.af.us.narwhal.upload.certification.CertificationUploadService;
import mil.af.us.narwhal.upload.qualification.QualificationUploadCSVRow;
import mil.af.us.narwhal.upload.qualification.QualificationUploadService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.ZoneId;

@Controller
@RequestMapping(UploadController.URI)
public class UploadController {
  public static final String URI = "/api/upload";

  private AirmanUploadService airmanUploadService;
  private QualificationUploadService qualificationUploadService;
  private CertificationUploadService certificationUploadService;

  public UploadController(
    AirmanUploadService airmanUploadService,
    QualificationUploadService qualificationUploadService,
    CertificationUploadService certificationUploadService
  ) {
    this.airmanUploadService = airmanUploadService;
    this.qualificationUploadService = qualificationUploadService;
    this.certificationUploadService = certificationUploadService;
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

  @PostMapping("/certification")
  public String importCertificationCSV(@RequestParam("file") MultipartFile file) throws IOException {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      CsvToBean csvToBean = new CsvToBeanBuilder<CertificationUploadCSVRow>(reader)
        .withType(CertificationUploadCSVRow.class)
        .withIgnoreLeadingWhiteSpace(true)
        .build();
      certificationUploadService.importToDatabase(csvToBean.parse());
      return "redirect:/";
    }
  }

  @PostMapping("/airmen/certifications")
  public String attachCertificationsCSV(
    @RequestParam("file") MultipartFile file,
    @RequestParam("timezone") String timezone
  ) throws IOException {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      CsvToBean csvToBean = new CsvToBeanBuilder<AttachCertificationCSVRow>(reader)
        .withType(AttachCertificationCSVRow.class)
        .withIgnoreLeadingWhiteSpace(true)
        .build();
      airmanUploadService.attachCertifications(csvToBean.parse(), ZoneId.of(timezone));
      return "redirect:/";
    }
  }
}
