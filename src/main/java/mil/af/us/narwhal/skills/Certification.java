package mil.af.us.narwhal.skills;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Certification {
  @Id
  private Long id;

  private String title;

  public Certification(Long id, String title) {
    this.id = id;
    this.title = title;
  }

  // Compliant
  public Certification() {
    // no-arg constructor
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
}
