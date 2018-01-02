package mil.af.us.narwhal.site;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiteRepository extends JpaRepository<Site, Long> {
  List<Site> findByName(String name);
}
