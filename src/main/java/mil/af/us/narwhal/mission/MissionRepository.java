package mil.af.us.narwhal.mission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface MissionRepository extends JpaRepository<Mission, Long> {
  List<Mission> findByStartDateTimeGreaterThanEqualOrderByStartDateTime(Instant date);

  Mission findOneByMissionId(String missionId);

  @Query("SELECT m FROM Mission m WHERE m.startDateTime <= ?2 AND (m.endDateTime IS NULL OR m.endDateTime >= ?1)")
  List<Mission> findAllOverlappingDuration(Instant start, Instant end);


  @Query("SELECT m FROM Mission m where m.id IN (SELECT msn.id from Mission msn LEFT JOIN msn.crewPositions cp WHERE cp.airman.id = ?1) AND m.startDateTime <= ?3 AND (m.endDateTime IS NULL OR m.endDateTime >= ?2)")
  List<Mission> findAllByAirmanIdAndOverlappingDuration(Long airmanId, Instant start, Instant end);
}
