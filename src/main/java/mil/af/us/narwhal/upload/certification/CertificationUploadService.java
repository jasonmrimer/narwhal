package mil.af.us.narwhal.upload.certification;

import mil.af.us.narwhal.skills.Certification;
import mil.af.us.narwhal.skills.CertificationRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CertificationUploadService {
  private CertificationRepository certificationRepository;

  public CertificationUploadService(CertificationRepository certificationRepository) {
    this.certificationRepository = certificationRepository;
  }

  public void importToDatabase(List<CertificationUploadCSVRow> rows) {
    Set<Certification> certifications = new HashSet<>();

    for (CertificationUploadCSVRow row : rows) {
      Certification existingCert = certificationRepository.findOneByTitle(row.getTitle());

      if (existingCert == null) {
        Certification certification = new Certification();
        certification.setTitle(row.getTitle());

        certifications.add(certification);
      }
    }
    certificationRepository.save(certifications);
  }
}
