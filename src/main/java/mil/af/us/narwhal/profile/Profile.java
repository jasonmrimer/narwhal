package mil.af.us.narwhal.profile;

import com.fasterxml.jackson.annotation.JsonIgnoreType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreType
public class Profile implements UserDetails {
  @Id
  @GeneratedValue
  private Long id;

  @Column(unique = true, nullable = false)
  private String username;

  @Column(name = "site_id")
  private Long siteId;

  @ManyToOne
  @JoinColumn(name = "role_id", nullable = false)
  private Role role;

  @Transient
  private String password = "";

  public Profile(String username, Role role) {
    this.username = username;
    this.role = role;
  }

  public Profile(String username, Long siteId) {
    this.username = username;
    this.siteId = siteId;
  }

  public Profile(String username, Long siteId, Role role) {
    this.username = username;
    this.siteId = siteId;
    this.role = role;
  }

  public Profile(long id, String username, Role role) {
    this.id = id;
    this.username = username;
    this.role = role;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return AuthorityUtils.createAuthorityList(role.getName());
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  public ProfileJSON toProfileJSON(boolean classified) {
    return new ProfileJSON(
      id,
      username,
      siteId,
      role.getShortName(),
      classified
    );
  }
}
