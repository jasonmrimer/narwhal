package mil.af.us.narwhal.skill;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(SkillController.URI)
public class SkillController {
  public static final String URI = "/api/skill";

  @Autowired private QualificationRepository qualificationRepository;
  @Autowired private CertificationRepository certificationRepository;

  @GetMapping(path = "/qualifications")
  public List<Qualification> indexQualifications() {
    return qualificationRepository.findAll();
  }

  @GetMapping(path = "/certifications")
  public List<Certification> indexCertifications() {
    return certificationRepository.findAll();
  }

  @GetMapping(path = "/certifications/{siteId}")
  public List<Certification> certificationBySiteId(@PathVariable Long siteId) {
    return certificationRepository.findAllBySiteId(siteId);
  }
}
