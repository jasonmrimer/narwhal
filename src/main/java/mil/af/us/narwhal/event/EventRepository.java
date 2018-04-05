package mil.af.us.narwhal.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
  @Query("SELECT e FROM Event e WHERE e.id IN (SELECT evt.id from Event evt LEFT JOIN evt.airman a WHERE a.flight.squadron.site.id = ?1) AND e.startTime <= ?3 AND (e.endTime IS NULL OR e.endTime >= ?2)")
  List<Event> findAllBySiteIdAndOverlappingDuration(Long siteId, Instant start, Instant end);

  @Query("SELECT e FROM Event e WHERE e.airman.id = ?1 and e.startTime <= ?3 AND (e.endTime IS NULL OR e.endTime >= ?2)")
  List<Event> findAllByAirmanIdAndOverlappingDuration(Long airmanId, Instant start, Instant end);
}
