package mil.af.us.narwhal.site;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteRepository extends JpaRepository<Site, Long> {
  Site findOneByName(String name);
}
