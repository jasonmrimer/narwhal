package mil.af.us.narwhal.admin;

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
  @MockBean private UploadService uploadService;

  @Test
  public void testImportCSV() throws Exception {
    final MockMultipartFile multipartFile = new MockMultipartFile(
      "file",
      "lastName,firstName,site,squadron,flight\nLast,First,SITE,SQUADRON,FLIGHT".getBytes()
    );
    final UploadCSVRow row = new UploadCSVRow(
      "First",
      "Last",
      "SITE",
      "SQUADRON",
      "FLIGHT"
    );

    mockMvc.perform(
      fileUpload(UploadController.URI).file(multipartFile)
        .with(httpBasic("tytus", "password")))
      .andExpect(status().is3xxRedirection());

    verify(uploadService).importToDatabase(singletonList(row));
  }
}