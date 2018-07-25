package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.site.SiteRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(AdminSiteController.URI)
public class AdminSiteController {
  public static final String URI = "/api/admin/sites";
  private SiteRepository siteRepository;

  public AdminSiteController(
    SiteRepository siteRepository
  ) {
    this.siteRepository = siteRepository;
  }

  @GetMapping
  public List<AdminSiteItemJSON> index() { return this.siteRepository.getAdminSites(); }
}
