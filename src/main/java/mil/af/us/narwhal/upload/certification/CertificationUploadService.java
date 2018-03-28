package mil.af.us.narwhal.upload.certification;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.skill.Certification;
import mil.af.us.narwhal.skill.CertificationRepository;
import mil.af.us.narwhal.upload.ImportException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CertificationUploadService {
  private CertificationRepository certificationRepository;
  private SiteRepository siteRepository;

  public CertificationUploadService(CertificationRepository certificationRepository, SiteRepository siteRepository) {
    this.certificationRepository = certificationRepository;
    this.siteRepository = siteRepository;
  }

  @Transactional
  public void importToDatabase(List<CertificationUploadCSVRow> rows) throws ImportException {
    List<Integer> failedRows = new ArrayList<>();

    Set<Certification> certifications = new HashSet<>();

    for (int i = 0; i < rows.size(); i++) {
      final CertificationUploadCSVRow row = rows.get(i);

      final Certification existingCert = certificationRepository.findOneByTitleAndSiteName(
        row.getTitle(),
        row.getSite()
      );

      if (existingCert == null) {
        final Site site = siteRepository.findOneByName(row.getSite());
        if (site != null) {
          certifications.add(new Certification(row.getTitle(), site));
        } else {
          failedRows.add(i + 1);
        }
      }

      certificationRepository.save(certifications);
    }

    if (failedRows.size() > 0) {
      throw new ImportException(failedRows);
    }
  }
}
