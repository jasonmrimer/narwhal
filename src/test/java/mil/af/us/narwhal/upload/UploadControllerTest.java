package mil.af.us.narwhal.upload;

import mil.af.us.narwhal.upload.airman.AirmanUploadCSVRow;
import mil.af.us.narwhal.upload.airman.AirmanUploadService;
import mil.af.us.narwhal.upload.certification.CertificationUploadService;
import mil.af.us.narwhal.upload.qualification.QualificationUploadService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static java.util.Collections.singletonList;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.fileUpload;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UploadController.class)
@RunWith(SpringRunner.class)
public class UploadControllerTest {
  @Autowired private MockMvc mockMvc;
  @MockBean private AirmanUploadService airmanUploadService;
  @MockBean private QualificationUploadService qualificationUploadService;
  @MockBean private CertificationUploadService certificationUploadService;

  @Test
  public void testImportAirmanCSV() throws Exception {
    final MockMultipartFile multipartFile = new MockMultipartFile(
      "file",
      "lastName,firstName,site,squadron,flight\nLast,First,SITE,SQUADRON,FLIGHT".getBytes()
    );
    final AirmanUploadCSVRow row = new AirmanUploadCSVRow(
      "First",
      "Last",
      "SITE",
      "SQUADRON",
      "FLIGHT"
    );

    mockMvc.perform(
      fileUpload(UploadController.URI + "/airman").file(multipartFile)
        .with(httpBasic("tytus", "password")))
      .andExpect(status().is3xxRedirection());

    verify(airmanUploadService).importToDatabase(singletonList(row));
  }
}