package mil.af.us.narwhal.mission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface MissionRepository extends JpaRepository<Mission, String> {
  List<Mission> findByStartDateTimeGreaterThanEqualOrderByStartDateTime(Instant date);
  Mission findOneByMissionId(String missionId);
}
