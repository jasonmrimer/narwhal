package mil.af.us.narwhal.mission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface MissionRepository extends JpaRepository<Mission, String> {
  List<Mission> findByStartDateTimeGreaterThanEqual(Instant date);
  List<Mission> findBySiteId(Long siteId);
  Mission findOneByMissionId(String missionId);
}
