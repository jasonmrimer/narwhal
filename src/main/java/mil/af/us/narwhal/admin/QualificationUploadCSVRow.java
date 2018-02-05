package mil.af.us.narwhal.admin;

import com.opencsv.bean.CsvBindByName;

import java.util.Objects;

public class QualificationUploadCSVRow {
  @CsvBindByName
  private String title;
  @CsvBindByName
  private String acronym;


  public QualificationUploadCSVRow() {
  }

  public QualificationUploadCSVRow(String title, String acronym) {
    this.title = title;
    this.acronym = acronym;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getAcronym() {
    return acronym;
  }

  public void setAcronym(String acronym) {
    this.acronym = acronym;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    QualificationUploadCSVRow that = (QualificationUploadCSVRow) o;
    return Objects.equals(title, that.title) &&
      Objects.equals(acronym, that.acronym);
  }

  @Override
  public int hashCode() {
    return Objects.hash(title, acronym);
  }
}
