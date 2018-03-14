package mil.af.us.narwhal.skill;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QualificationRepository extends JpaRepository<Qualification, Long> {
  Qualification findOneByTitle(String title);
}
