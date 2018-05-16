package mil.af.us.narwhal.skill;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(QualificationController.URI)
public class QualificationController {
  public static final String URI = "/api/qualifications";

  private QualificationRepository qualificationRepository;

  public QualificationController(QualificationRepository qualificationRepository) {
    this.qualificationRepository = qualificationRepository;
  }

  @GetMapping
  public List<Qualification> indexQualifications() {
    return qualificationRepository.findAll();
  }
}
