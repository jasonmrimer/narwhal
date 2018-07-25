package mil.af.us.narwhal.site;

import mil.af.us.narwhal.admin.AdminSiteItemJSON;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SiteRepository extends JpaRepository<Site, Long> {
  Site findOneByName(String name);

  @Query(
    "SELECT " +
      "new mil.af.us.narwhal.admin.AdminSiteItemJSON(s.id, s.name) " +
      "FROM Site AS s "
  )
  List<AdminSiteItemJSON> getAdminSites();
}
