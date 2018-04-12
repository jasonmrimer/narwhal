package mil.af.us.narwhal.mission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface MissionRepository extends JpaRepository<Mission, Long> {
  List<Mission> findByStartDateTimeGreaterThanEqualOrderByStartDateTime(Instant date);

  Mission findOneByMissionId(String missionId);

  @Query("SELECT m FROM Mission m where m.id IN (SELECT msn.id from Mission msn LEFT JOIN msn.crewPositions cp WHERE cp.airman.flight.squadron.site.id = ?1) AND m.startDateTime <= ?3 AND (m.endDateTime IS NULL OR m.endDateTime >= ?2)")
  List<Mission> findAllBySiteIdAndOverlappingDuration(Long siteId, Instant start, Instant end);

  @Query("SELECT m FROM Mission m WHERE m.id IN (SELECT msn.id from Mission msn LEFT JOIN msn.crewPositions cp WHERE cp.airman.id = ?1) AND m.startDateTime <= ?3 AND (m.endDateTime IS NULL OR m.endDateTime >= ?2)")
  List<Mission> findAllByAirmanIdAndOverlappingDuration(Long airmanId, Instant start, Instant end);

  @Query("SELECT DISTINCT mission.platform from Mission mission where mission.site.id = ?1 AND mission.startDateTime <= ?3 AND (mission.endDateTime IS NULL OR mission.endDateTime >= ?2)")
  List<String> findPlatformsBySiteIdAndOverlappingDuration(Long siteId, Instant start, Instant end);

  @Query("SELECT DISTINCT mission.platform from Mission mission where mission.startDateTime <= ?2 AND (mission.endDateTime IS NULL OR mission.endDateTime >= ?1)")
  List<String> findAllPlatformsByOverlappingDuration(Instant start, Instant end);
}
