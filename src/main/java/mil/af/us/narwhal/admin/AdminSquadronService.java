package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import mil.af.us.narwhal.squadron.SquadronRepository;

public class AdminSquadronService {
  private SiteRepository siteRepository;
  private SquadronRepository squadronRepository;

  public AdminSquadronService(
    SiteRepository siteRepository,
    SquadronRepository squadronRepository
  ) {
    this.siteRepository = siteRepository;
    this.squadronRepository = squadronRepository;
  }

  public AdminSquadronItemJSON createSquadron(AdminSquadronItemJSON item) {
    Squadron squadron = new Squadron();
    final Site site = this.siteRepository.findOne(item.getSiteId());
    squadron.setSite(site);
    squadron.setName(item.getSquadronName());
    squadron = this.squadronRepository.save(squadron);
    item.setSquadronId(squadron.getId());
    return item;
  }
}
