package mil.af.us.narwhal.skill;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
  Certification findOneByTitleAndSiteName(String title, String siteName);

  Certification findOneByTitleAndSiteId(String title, Long siteId);
}
