package mil.af.us.narwhal.mission;

import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.xml.transform.StringSource;
import unicorn.GetMissionMetaDataResponse;

import javax.xml.bind.JAXB;
import java.time.Instant;
import java.util.List;

import static java.util.Collections.emptyList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class MissionServiceTest {
  private final Site site1 = new Site(1L, "DGS-1", emptyList());
  private final Site site2 = new Site(2L, "DGS-2", emptyList());
  private GetMissionMetaDataResponse getMissionMetaDataResponse;

  @Mock private MissionRepository missionRepository;
  @Mock private SiteRepository siteRepository;
  @Mock private MissionClient missionClient;
  @Captor private ArgumentCaptor<List<Mission>> captor;
  private MissionService subject;

  private MissionClientStub client = new MissionClientStub();

  @Before
  public void setUp() {
    when(siteRepository.findOneByName(site1.getName())).thenReturn(site1);
    when(siteRepository.findOneByName(site2.getName())).thenReturn(site2);

    //language=XML
    String xml = "<GetMissionMetaDataResponse xmlns=\"Unicorn\">\n" +
      "  <GetMissionMetaDataResult>\n" +
      "    <results xmlns=\"\">\n" +
      "      <missionMetaData>\n" +
      "        <missionid>70497d73-a7e4-4000-879a-feaf9099bfa1</missionid>\n" +
      "        <description>U2 over</description>\n" +
      "        <missionStatus>CLOSED</missionStatus>\n" +
      "        <classification>Unclassified</classification>\n" +
      "        <distrocontrol>FOUO</distrocontrol>\n" +
      "        <atomissionnumber>HGZ3W09</atomissionnumber>\n" +
      "        <atoday>aaa</atoday>\n" +
      "        <startdttime>12-12-2017T04:29:00.0Z</startdttime>\n" +
      "        <enddttime>12-12-2017T04:29:00.0Z</enddttime>\n" +
      "        <primaryorg>DGS-1</primaryorg>\n" +
      "        <callsign>Spaceman</callsign>\n" +
      "        <platform>U2</platform>\n" +
      "        <tailnumber>NW1</tailnumber>\n" +
      "        <missionstatickmllink>\n" +
      "          http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=false\n" +
      "        </missionstatickmllink>\n" +
      "        <missiondynamickmllink>\n" +
      "          http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=true\n" +
      "        </missiondynamickmllink>\n" +
      "        <unicornmissiondataurl>\n" +
      "          http://codweb1.leidoshost.com/UNICORN.NET/pages/public/publiccustomerreport.aspx?strATO=HGZ3W09\n" +
      "        </unicornmissiondataurl>\n" +
      "      </missionMetaData>\n" +
      "    </results>\n" +
      "  </GetMissionMetaDataResult>\n" +
      "</GetMissionMetaDataResponse>";

    getMissionMetaDataResponse = JAXB.unmarshal(new StringSource(xml), GetMissionMetaDataResponse.class);
  }

  @Test
  public void refreshMissions_savesMissions() {

    when(missionClient.getMissionMetaData())
      .thenReturn(getMissionMetaDataResponse.getGetMissionMetaDataResult().getResults().getMissionMetaData());

    subject = new MissionService(missionRepository, missionClient, siteRepository);

    subject.refreshMissions();

    verify(missionRepository).save(captor.capture());

    List<Mission> value = captor.getValue();
    assertThat(value.get(0).getAtoMissionNumber()).isEqualTo("HGZ3W09");
    assertThat(value.get(0).getMissionId()).isEqualTo("70497d73-a7e4-4000-879a-feaf9099bfa1");
    assertThat(value.get(0).getStartDateTime()).isEqualTo(Instant.parse("2017-12-12T04:29:00Z"));
    assertThat(value.get(0).getEndDateTime()).isEqualTo(Instant.parse("2017-12-12T04:29:00Z"));
    assertThat(value.get(0).getSite()).isEqualTo(site1);
  }

  @Test
  public void refreshMissions_handlesUnknownSites() {
    //language=XML
    String xml = "<GetMissionMetaDataResponse xmlns=\"Unicorn\">\n" +
      "  <GetMissionMetaDataResult>\n" +
      "    <results xmlns=\"\">\n" +
      "      <missionMetaData>\n" +
      "        <missionid>70497d73-a7e4-4000-879a-feaf9099bfa1</missionid>\n" +
      "        <description>U2 over</description>\n" +
      "        <missionStatus>CLOSED</missionStatus>\n" +
      "        <classification>Unclassified</classification>\n" +
      "        <distrocontrol>FOUO</distrocontrol>\n" +
      "        <atomissionnumber>HGZ3W09</atomissionnumber>\n" +
      "        <atoday>aaa</atoday>\n" +
      "        <startdttime>12-12-2017T04:29:00.0Z</startdttime>\n" +
      "        <enddttime>12-12-2017T04:29:00.0Z</enddttime>\n" +
      "        <primaryorg>XBOW</primaryorg>\n" +
      "        <callsign>Spaceman</callsign>\n" +
      "        <platform>U2</platform>\n" +
      "        <tailnumber>NW1</tailnumber>\n" +
      "        <missionstatickmllink>\n" +
      "          http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=false\n" +
      "        </missionstatickmllink>\n" +
      "        <missiondynamickmllink>\n" +
      "          http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=true\n" +
      "        </missiondynamickmllink>\n" +
      "        <unicornmissiondataurl>\n" +
      "          http://codweb1.leidoshost.com/UNICORN.NET/pages/public/publiccustomerreport.aspx?strATO=HGZ3W09\n" +
      "        </unicornmissiondataurl>\n" +
      "      </missionMetaData>\n" +
      "    </results>\n" +
      "  </GetMissionMetaDataResult>\n" +
      "</GetMissionMetaDataResponse>";

    getMissionMetaDataResponse = JAXB.unmarshal(new StringSource(xml), GetMissionMetaDataResponse.class);
    when(missionClient.getMissionMetaData()).thenReturn(getMissionMetaDataResponse.getGetMissionMetaDataResult().getResults().getMissionMetaData());

    subject = new MissionService(missionRepository, missionClient, siteRepository);
    subject.refreshMissions();

    verify(missionRepository).save(captor.capture());
    Assertions.assertThat(captor.getValue().get(0).getSite()).isNull();
  }

  @Test
  public void refreshMissions_handlesNullEndDates() {
    //language=XML
    String xml = "<GetMissionMetaDataResponse xmlns=\"Unicorn\">\n" +
      "  <GetMissionMetaDataResult>\n" +
      "    <results xmlns=\"\">\n" +
      "      <missionMetaData>\n" +
      "        <missionid>70497d73-a7e4-4000-879a-feaf9099bfa1</missionid>\n" +
      "        <description>U2 over</description>\n" +
      "        <missionStatus>CLOSED</missionStatus>\n" +
      "        <classification>Unclassified</classification>\n" +
      "        <distrocontrol>FOUO</distrocontrol>\n" +
      "        <atomissionnumber>HGZ3W09</atomissionnumber>\n" +
      "        <atoday>aaa</atoday>\n" +
      "        <startdttime>12-12-2017T04:29:00.0Z</startdttime>\n" +
      "        <enddttime />\n" +
      "        <primaryorg>XBOW</primaryorg>\n" +
      "        <callsign>Spaceman</callsign>\n" +
      "        <platform>U2</platform>\n" +
      "        <tailnumber>NW1</tailnumber>\n" +
      "        <missionstatickmllink>\n" +
      "          http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=false\n" +
      "        </missionstatickmllink>\n" +
      "        <missiondynamickmllink>\n" +
      "          http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=true\n" +
      "        </missiondynamickmllink>\n" +
      "        <unicornmissiondataurl>\n" +
      "          http://codweb1.leidoshost.com/UNICORN.NET/pages/public/publiccustomerreport.aspx?strATO=HGZ3W09\n" +
      "        </unicornmissiondataurl>\n" +
      "      </missionMetaData>\n" +
      "    </results>\n" +
      "  </GetMissionMetaDataResult>\n" +
      "</GetMissionMetaDataResponse>";

    getMissionMetaDataResponse = JAXB.unmarshal(new StringSource(xml), GetMissionMetaDataResponse.class);
    when(missionClient.getMissionMetaData()).thenReturn(getMissionMetaDataResponse.getGetMissionMetaDataResult().getResults().getMissionMetaData());

    subject = new MissionService(missionRepository, missionClient, siteRepository);
    subject.refreshMissions();

    verify(missionRepository).save(captor.capture());
    Assertions.assertThat(captor.getValue().get(0).getSite()).isNull();
  }
}