package mil.af.us.narwhal.crew;

import mil.af.us.narwhal.mission.Mission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CrewRepository extends JpaRepository<Crew, Long> {
  Crew findOneByMission(Mission mission);
}
