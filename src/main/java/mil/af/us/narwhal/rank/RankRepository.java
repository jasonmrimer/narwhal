package mil.af.us.narwhal.rank;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RankRepository extends JpaRepository<Rank, Long> {
  Rank findRankByAbbreviation(String abbreviation);
}
