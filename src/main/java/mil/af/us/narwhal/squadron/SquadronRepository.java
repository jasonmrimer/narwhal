package mil.af.us.narwhal.squadron;

import mil.af.us.narwhal.admin.AdminSquadronItemJSON;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SquadronRepository extends JpaRepository<Squadron, Long> {

  @Query(
    "SELECT " +
      "new mil.af.us.narwhal.admin.AdminSquadronItemJSON(sq.site.id, sq.site.name, sq.id, sq.name) " +
      "FROM Squadron AS sq "
  )
  List<AdminSquadronItemJSON> getAdminSquadrons();
}