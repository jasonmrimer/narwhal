package mil.af.us.narwhal.admin;

import com.opencsv.bean.CsvBindByName;

import java.util.Objects;

public class UploadCSVRow {
  @CsvBindByName
  private String firstName;

  @CsvBindByName
  private String lastName;

  @CsvBindByName
  private String site;

  @CsvBindByName
  private String squadron;

  @CsvBindByName
  private String flight;

  public UploadCSVRow() {
  }

  public UploadCSVRow(
    String firstName,
    String lastName,
    String site,
    String squadron,
    String flight
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.site = site;
    this.squadron = squadron;
    this.flight = flight;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getSite() {
    return site.toUpperCase();
  }

  public void setSite(String site) {
    this.site = site;
  }

  public String getSquadron() {
    return squadron.toUpperCase();
  }

  public void setSquadron(String squadron) {
    this.squadron = squadron;
  }

  public String getFlight() {
    return flight.toUpperCase();
  }

  public void setFlight(String flight) {
    this.flight = flight;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    UploadCSVRow that = (UploadCSVRow) o;
    return Objects.equals(firstName, that.firstName) &&
      Objects.equals(lastName, that.lastName) &&
      Objects.equals(site, that.site) &&
      Objects.equals(squadron, that.squadron) &&
      Objects.equals(flight, that.flight);
  }

  @Override
  public int hashCode() {
    return Objects.hash(firstName, lastName, site, squadron, flight);
  }
}
