package mil.af.us.narwhal.skill;

import mil.af.us.narwhal.ErrorResponse;
import mil.af.us.narwhal.profile.Profile;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static java.util.Collections.emptyList;

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
  public ResponseEntity<Object> update(
    @PathVariable Long id,
    @Valid
    @RequestBody CertificationJSON certificationJSON
  ) {
    try {
      final Certification certification = this.certificationRepository.findOne(id);
      certification.setTitle(certificationJSON.getTitle());
      return new ResponseEntity<>(
        this.certificationRepository.save(certification),
        HttpStatus.OK
      );
    } catch (Exception e) {
      if (!(e.getCause() instanceof ConstraintViolationException)) throw e;
      return new ResponseEntity<>(
        new ErrorResponse().addError("title", "Certification must be unique."),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @PostMapping
  public ResponseEntity<Object> create(
    @AuthenticationPrincipal Profile profile,
    @Valid
    @RequestBody CertificationJSON certificationJSON
  ) {
    try {
      final Site site = siteRepository.findOne(profile.getSite().getId());
      final Certification certification = new Certification(
        certificationJSON.getTitle(),
        site
      );
      return new ResponseEntity<>(
        this.certificationRepository.save(certification),
        HttpStatus.CREATED
      );
    } catch (Exception e) {
      if (!(e.getCause() instanceof ConstraintViolationException)) throw e;
      return new ResponseEntity<>(
        new ErrorResponse().addError("title", "Certification must be unique."),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @DeleteMapping(value = "/{id}")
  public ResponseEntity<Object> delete(@PathVariable Long id) {
    this.certificationRepository.delete(id);
    return new ResponseEntity<>(
      emptyList(),
      HttpStatus.OK
    );
  }
}
