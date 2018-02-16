package mil.af.us.narwhal.profile;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
  Profile findOneByUsername(String username);
}
