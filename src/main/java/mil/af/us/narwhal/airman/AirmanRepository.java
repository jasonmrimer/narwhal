package mil.af.us.narwhal.airman;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AirmanRepository extends JpaRepository<Airman, Long> {
  @Query(value="select a from Airman a where flight_id in (select id from Flight where squadron_id = ?1)")
  List<Airman> findBySquadronId(Long squadronId);

  @Query(value="select a from Airman a where flight_id = ?1")
  List<Airman> findByFlightId(Long flightId);

  List<Airman> findAllAndByOrderByLastName();

  Airman findOneByFirstNameAndLastName(String firstName, String lastName);
}
