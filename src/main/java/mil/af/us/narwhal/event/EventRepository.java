package mil.af.us.narwhal.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
  @Query("SELECT e FROM Event e WHERE e.startTime <= ?2 AND (e.endTime IS NULL OR e.endTime >= ?1)")
  List<Event> findAllOverlappingDuration(Instant start, Instant end);

  @Query("SELECT e FROM Event e WHERE e.airmanId = ?1 and e.startTime <= ?3 AND (e.endTime IS NULL OR e.endTime >= ?2)")
  List<Event> findAllByAirmanIdAndOverlappingDuration(Long airmanId, Instant start, Instant end);
}
