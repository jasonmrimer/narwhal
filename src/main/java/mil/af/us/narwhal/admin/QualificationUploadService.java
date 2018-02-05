package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.skills.Qualification;
import mil.af.us.narwhal.skills.QualificationRepository;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class QualificationUploadService {
  QualificationRepository qualificationRepository;

  public QualificationUploadService(QualificationRepository qualificationRepository) {
    this.qualificationRepository = qualificationRepository;
  }

  public void importToDatabase(List<QualificationUploadCSVRow> rows) {
    Set<Qualification> qualifications = new HashSet<>();

    for(QualificationUploadCSVRow row : rows) {
      List<Qualification> existingQuals = qualificationRepository.findByTitle(row.getTitle());
      if (existingQuals.isEmpty()) {
        Qualification qualification = new Qualification();
        qualification.setAcronym(row.getAcronym());
        qualification.setTitle(row.getTitle());

        qualifications.add(qualification);

      }
    }

    qualificationRepository.save(qualifications);
  }
}
