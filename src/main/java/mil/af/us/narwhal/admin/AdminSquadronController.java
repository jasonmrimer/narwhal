package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.SquadronRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(AdminSquadronController.URI)
public class AdminSquadronController{
  public static final String URI = "/api/admin/squadrons";
  private SiteRepository siteRepository;
  private SquadronRepository squadronRepository;

  public AdminSquadronController(
    SiteRepository siteRepository,
    SquadronRepository squadronRepository
  ) {
    this.siteRepository = siteRepository;
    this.squadronRepository = squadronRepository;
  }

  @GetMapping
  public List<AdminSquadronItemJSON> index() {
    return this.squadronRepository.getAdminSquadrons();
  }

  @PostMapping
  public ResponseEntity<AdminSquadronItemJSON> createAdminSquadronItem(@Valid @RequestBody AdminSquadronItemJSON item) {
    final AdminSquadronService adminSquadronService = new AdminSquadronService(
      this.siteRepository,
      this.squadronRepository
    );
    return new ResponseEntity<>(adminSquadronService.createSquadron(item), HttpStatus.CREATED);
  }
}

