package mil.af.us.narwhal.upload;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.exceptions.CsvException;
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
  public ResponseEntity<String> importAirmanCSV(@RequestParam("file") MultipartFile file) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, AirmanUploadCSVRow.class);
      airmanUploadService.importToDatabase(rows);
      return successResponse();
    } catch (ImportException e) {
      return errorResponse(
        e.toString() +
          "\nCheck that your sites and squadrons are identical to the ones on the tracker filters, " +
          "eg. sites are formatted as DMS-TX and squadrons as 3 IS.");
    } catch (CSVParseException e) {
      return errorResponse(e.toString());
    } catch (Exception e) {
      return errorResponse("Upload was unsuccessful. " + e.getCause().getMessage());
    }
  }

  @PostMapping("/qualifications")
  public ResponseEntity<String> importQualificationCSV(@RequestParam("file") MultipartFile file) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, QualificationUploadCSVRow.class);
      qualificationUploadService.importToDatabase(rows);
      return successResponse();
    } catch (Exception e) {
      return errorResponse("Something went wrong with your .CSV upload.");
    }
  }

  @PostMapping("/certifications")
  public ResponseEntity<String> importCertificationCSV(@RequestParam("file") MultipartFile file) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, CertificationUploadCSVRow.class);
      certificationUploadService.importToDatabase(rows);
      return successResponse();
    } catch (ImportException e) {
      return errorResponse(
        e.toString() +
          "\nCheck that your sites are identical to the ones on the tracker filters, " +
          "eg. sites are formatted as DMS-TX.");
    } catch (CSVParseException e) {
      return errorResponse(e.toString());
    } catch (Exception e) {
      return errorResponse("Upload was unsuccessful. " + e.getCause().getMessage());
    }
  }

  @PostMapping("/airmen/certifications")
  public ResponseEntity<String> attachCertificationsCSV(
    @RequestParam("file") MultipartFile file,
    @RequestParam("timezone") String timezone
  ) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, AttachCertificationCSVRow.class);
      airmanUploadService.attachCertifications(rows, ZoneId.of(timezone));
      return successResponse();
    } catch (ImportException e) {
      return errorResponse(
        e.toString() +
          "\nCheck that your date is formatted as mm/dd/yyyy.\n" +
          "Check that the certificates have already been uploaded and spelled correctly. \n" +
          "Check that all airmen have already been uploaded.");
    } catch (CSVParseException e) {
      return errorResponse(e.toString());
    } catch (Exception e) {
      return errorResponse("Upload was unsuccessful. " + e.getCause().getMessage());
    }
  }

  @PostMapping("/airmen/qualifications")
  public ResponseEntity<String> attachQualificationsCSV(
    @RequestParam("file") MultipartFile file,
    @RequestParam("timezone") String timezone
  ) {
    try (Reader reader = new InputStreamReader(file.getInputStream())) {
      final List rows = getRows(reader, AttachQualificationCSVRow.class);
      airmanUploadService.attachQualifications(rows, ZoneId.of(timezone));
      return successResponse();
    }  catch (ImportException e) {
      return errorResponse(
        e.toString() +
          "\nCheck that your date is formatted as mm/dd/yyyy.\n" +
          "Check that the qualifications have already been uploaded and spelled correctly. \n" +
          "Check that all airmen have already been uploaded.");
    } catch (CSVParseException e) {
      return errorResponse(e.toString());
    } catch (Exception e) {
      return errorResponse("Upload was unsuccessful. " + e.getCause().getMessage());
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

  private ResponseEntity<String> successResponse() {
    return new ResponseEntity<>("Successfully uploaded file.", HttpStatus.CREATED);
  }

  private ResponseEntity<String> errorResponse(String message) {
    return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
  }
}
