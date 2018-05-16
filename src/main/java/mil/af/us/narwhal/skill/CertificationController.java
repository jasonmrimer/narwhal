package mil.af.us.narwhal.skill;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(CertificationController.URI)
public class CertificationController {
  public static final String URI = "/api/certifications";

  private CertificationRepository certificationRepository;
  private SiteRepository siteRepository;

  public CertificationController(CertificationRepository certificationRepository, SiteRepository siteRepository) {
    this.certificationRepository = certificationRepository;
    this.siteRepository = siteRepository;
  }

  @GetMapping
  public List<Certification> index(@RequestParam(required = false) Long siteId) {
    if (siteId != null) {
      return certificationRepository.findAllBySiteId(siteId);
    } else {
      return certificationRepository.findAll();
    }
  }

  @GetMapping(path = "/{id}")
  public Certification show(@PathVariable("id") Long id) {
    return this.certificationRepository.findOne(id);
  }

  @PutMapping(path = "/{id}")
  public Certification update(
    @PathVariable Long id,
    @RequestBody CertificationJSON certificationJSON
  ) {
    final Site site = siteRepository.findOne(certificationJSON.getSiteId());
    final Certification certification = new Certification(
      certificationJSON.getId(),
      certificationJSON.getTitle(),
      site
    );

    return this.certificationRepository.save(certification);
  }
}
