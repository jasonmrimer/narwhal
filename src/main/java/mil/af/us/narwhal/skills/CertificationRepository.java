package mil.af.us.narwhal.skills;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
  Certification findOneByTitle(String title);
}
