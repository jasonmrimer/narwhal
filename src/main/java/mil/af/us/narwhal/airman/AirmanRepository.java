package mil.af.us.narwhal.airman;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AirmanRepository extends JpaRepository<Airman, Long> {
  List<Airman> findByUnitId(Long unitId);

  List<Airman> findByCrewId(Long unitId);
}
