package mil.af.us.narwhal.upload.qualification;

import mil.af.us.narwhal.skill.Qualification;
import mil.af.us.narwhal.skill.QualificationRepository;
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
      Qualification existingQual = qualificationRepository.findOneByTitle(row.getTitle());
      if (existingQual == null) {
        Qualification qualification = new Qualification();
        qualification.setAcronym(row.getAcronym());
        qualification.setTitle(row.getTitle());

        qualifications.add(qualification);

      }
    }

    qualificationRepository.save(qualifications);
  }
}
