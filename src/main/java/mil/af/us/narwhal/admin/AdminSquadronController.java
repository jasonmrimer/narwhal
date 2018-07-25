package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.squadron.SquadronRepository;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(AdminSquadronController.URI)
public class AdminSquadronController{
  public static final String URI = "/api/admin/squadrons";
  private SquadronRepository squadronRepository;

  public AdminSquadronController(
    SquadronRepository squadronRepository) {
    this.squadronRepository = squadronRepository;
  }

  @GetMapping
  public List<AdminSquadronItemJSON> Index() {
    return this.squadronRepository.getAdminSquadrons();
  }

  @PostMapping
  public AdminSquadronItemJSON Create(@Valid @RequestBody AdminSquadronItemJSON item) {
    return new AdminSquadronItemJSON();
  }
}

