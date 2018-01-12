package mil.af.us.narwhal.mission;

import mil.af.us.narwhal.site.Site;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.Instant;

@Entity
public class Mission {
  @Id
  private String missionId;

  private String atoMissionNumber;
  private Instant startDateTime;
  private Instant endDateTime;

  @ManyToOne
  private Site site;

  public Mission() {
  }

  public Mission(String missionId, String atoMissionNumber, Instant startDateTime, Instant endDateTime, Site site) {
    this.missionId = missionId;
    this.atoMissionNumber = atoMissionNumber;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.site = site;
  }
  public Mission(
    String missionId,
    String atoMissionNumber,
    Instant startDateTime,
    Site site) {
      this.missionId = missionId;
      this.atoMissionNumber = atoMissionNumber;
      this.startDateTime = startDateTime;
      this.site = site;
  }

  private Mission(Builder builder) {
    setMissionId(builder.missionId);
    setAtoMissionNumber(builder.atoMissionNumber);
    setStartDateTime(builder.startDateTime);
    setEndDateTime(builder.endDateTime);
    setSite(builder.site);
  }

  public String getMissionId() {
    return missionId;
  }

  public void setMissionId(String missionId) {
    this.missionId = missionId;
  }

  public String getAtoMissionNumber() {
    return atoMissionNumber;
  }

  public void setAtoMissionNumber(String atoMissionNumber) {
    this.atoMissionNumber = atoMissionNumber;
  }

  public Instant getStartDateTime() {
    return startDateTime;
  }

  public void setStartDateTime(Instant startDateTime) {
    this.startDateTime = startDateTime;
  }

  public Instant getEndDateTime() {
    return endDateTime;
  }

  public void setEndDateTime(Instant endDateTime) {
    this.endDateTime = endDateTime;
  }

  public Site getSite() {
    return site;
  }

  public void setSite(Site site) {
    this.site = site;
  }

  public static final class Builder {
    private String missionId;
    private String atoMissionNumber;
    private Instant startDateTime;
    private Instant endDateTime;
    private Site site;

    public Builder() {
    }

    public Builder missionId(String val) {
      missionId = val;
      return this;
    }

    public Builder atoMissionNumber(String val) {
      atoMissionNumber = val;
      return this;
    }

    public Builder startDateTime(Instant val) {
      startDateTime = val;
      return this;
    }

    public Builder endDateTime(Instant val) {
      endDateTime = val;
      return this;
    }

    public Builder site(Site val) {
      site = val;
      return this;
    }

    public Mission build() {
      return new Mission(this);
    }
  }
}
