package mil.af.us.narwhal.qualification;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Qualification {
  @Id
  private Long id;

  private String acronym;

  private String title;

  // Compliant
  public Qualification() {
    // no-arg constructor
  }

  public Qualification(Long id, String acronym, String title) {
    this.id = id;
    this.acronym = acronym;
    this.title = title;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getAcronym() {
    return acronym;
  }

  public void setAcronym(String acronym) {
    this.acronym = acronym;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
}
