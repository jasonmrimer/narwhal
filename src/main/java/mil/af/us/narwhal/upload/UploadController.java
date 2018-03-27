package mil.af.us.narwhal.upload;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import mil.af.us.narwhal.upload.airman.AirmanUploadCSVRow;
import mil.af.us.narwhal.upload.airman.AirmanUploadService;
import mil.af.us.narwhal.upload.airman.AttachCertificationCSVRow;
import mil.af.us.narwhal.upload.airman.AttachQualificationCSVRow;
import mil.af.us.narwhal.upload.certification.CertificationUploadCSVRow;
import mil.af.us.narwhal.upload.certification.CertificationUploadService;
import mil.af.us.narwhal.upload.qualification.QualificationUploadCSVRow;
import mil.af.us.narwhal.upload.qualification.QualificationUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.time.ZoneId;
import java.util.List;

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

  @PostMapping("/airmen")
  @SuppressWarnings("unchecked")
  public ResponseEntity<Void> importAirmanCSV(@RequestParam("file") MultipartFile file) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, AirmanUploadCSVRow.class);
      airmanUploadService.importToDatabase(rows);
      return successResponse();
    } catch (Exception e) {
      return errorResponse();
    }
  }

  @PostMapping("/qualifications")
  public ResponseEntity<Void> importQualificationCSV(@RequestParam("file") MultipartFile file) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, QualificationUploadCSVRow.class);
      qualificationUploadService.importToDatabase(rows);
      return successResponse();
    } catch (Exception e) {
      return errorResponse();
    }
  }

  @PostMapping("/certifications")
  public ResponseEntity<Void> importCertificationCSV(@RequestParam("file") MultipartFile file) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, CertificationUploadCSVRow.class);
      certificationUploadService.importToDatabase(rows);
      return successResponse();
    } catch (Exception e) {
      return errorResponse();
    }
  }

  @PostMapping("/airmen/certifications")
  public ResponseEntity<Void> attachCertificationsCSV(
    @RequestParam("file") MultipartFile file,
    @RequestParam("timezone") String timezone
  ) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, AttachCertificationCSVRow.class);
      airmanUploadService.attachCertifications(rows, ZoneId.of(timezone));
      return successResponse();
    } catch (Exception e) {
      return errorResponse();
    }
  }

  @PostMapping("/airmen/qualifications")
  public ResponseEntity<Void> attachQualificationsCSV(
    @RequestParam("file") MultipartFile file,
    @RequestParam("timezone") String timezone
  ) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, AttachQualificationCSVRow.class);
      airmanUploadService.attachQualifications(rows, ZoneId.of(timezone));
      return successResponse();
    } catch (Exception e) {
      return errorResponse();
    }
  }

  private List getRows(Reader reader, Class cls) throws CSVParseException {
    CsvToBean csvToBean = new CsvToBeanBuilder<>(reader)
      .withType(cls)
      .withIgnoreLeadingWhiteSpace(true)
      .withThrowExceptions(false)
      .build();

    final List rows = csvToBean.parse();

    final List exceptions = csvToBean.getCapturedExceptions();
    if (exceptions.size() > 0) {
      throw new CSVParseException(exceptions);
    }

    return rows;
  }

  private ResponseEntity<Void> successResponse() {
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  private ResponseEntity<Void> errorResponse() {
    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
  }
}
