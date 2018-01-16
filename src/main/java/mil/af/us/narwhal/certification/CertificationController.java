package mil.af.us.narwhal.certification;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(CertificationController.URI)
public class CertificationController {
  public static final String URI = "/api/certifications";

  private CertificationRepository certificationRepository;

  public CertificationController(CertificationRepository certificationRepository) {
    this.certificationRepository = certificationRepository;
  }

  @GetMapping
  public List<Certification> index() {
    return certificationRepository.findAll();
  }
}
