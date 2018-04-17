package mil.af.us.narwhal.upload.certification;

import mil.af.us.narwhal.BaseIntegrationTest;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.skill.Certification;
import mil.af.us.narwhal.skill.CertificationRepository;
import mil.af.us.narwhal.upload.ImportException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.AbstractMap.SimpleEntry;
import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;

public class CertificationUploadServiceTest extends BaseIntegrationTest {
  @Autowired private CertificationRepository certificationRepository;
  @Autowired private SiteRepository siteRepository;
  private CertificationUploadService subject;

  @Before
  public void setUp() throws ImportException {
    super.setUp();

    siteRepository.save(asList(
      new Site("DMS-GA"),
      new Site("DMS-MD")
    ));

    subject = new CertificationUploadService(certificationRepository, siteRepository);
    subject.importToDatabase(asList(
      new CertificationUploadCSVRow("Cert A", "DMS-GA"),
      new CertificationUploadCSVRow("Cert B", "DMS-GA"),
      new CertificationUploadCSVRow("Cert B", "DMS-MD"),
      new CertificationUploadCSVRow("Cert C", "DMS-MD")
    ));
  }

  @After
  public void tearDown() {
    super.tearDown();
  }

  @Test
  public void testImportToDatabase() {
    final List<Certification> certifications = certificationRepository.findAll();

    List<SimpleEntry<String, String>> titleAndSiteName = certifications.stream()
      .map(cert -> new SimpleEntry<>(cert.getTitle(), cert.getSite().getName()))
      .collect(toList());

    assertThat(titleAndSiteName).containsExactlyInAnyOrder(
      new SimpleEntry<>("Cert A", "DMS-GA"),
      new SimpleEntry<>("Cert B", "DMS-GA"),
      new SimpleEntry<>("Cert B", "DMS-MD"),
      new SimpleEntry<>("Cert C", "DMS-MD")
    );
  }

  @Test
  public void testImportToDatabase_canAddSameTitleToDifferentSite() throws ImportException {
    subject.importToDatabase(singletonList(new CertificationUploadCSVRow("Cert C", "DMS-GA")));
    assertThat(certificationRepository.count()).isEqualTo(5);
  }

  @Test
  public void testImportToDatabase_doesNotDuplicate() throws ImportException {
    subject.importToDatabase(singletonList(new CertificationUploadCSVRow("Cert A", "DMS-GA")));
    assertThat(certificationRepository.count()).isEqualTo(4);
  }
}