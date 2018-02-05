package mil.af.us.narwhal.skills;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QualificationRepository extends JpaRepository<Qualification, Long> {
  List<Qualification> findByTitle(String title);
}
