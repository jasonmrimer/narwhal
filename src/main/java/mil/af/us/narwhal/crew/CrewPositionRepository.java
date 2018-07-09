package mil.af.us.narwhal.crew;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CrewPositionRepository extends JpaRepository<CrewPosition, Long> {
  @Transactional
  void deleteOneByMissionIdAndAirmanId(Long missionId, Long airmanId);
}