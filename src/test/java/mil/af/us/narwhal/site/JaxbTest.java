package mil.af.us.narwhal.site;


import generated.Results;
import org.junit.Test;
import org.springframework.xml.transform.StringSource;
import unicorn.GetMissionMetaDataResponse;

import javax.xml.bind.JAXB;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.transform.stream.StreamResult;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

public class JaxbTest {
  @Test
  public void indexTest() {
    //language=XML
    String xml = "<GetMissionMetaDataResponse xmlns=\"Unicorn\">\n" +
      "  <GetMissionMetaDataResult>\n" +
      "    <results xmlns=\"\">\n" +
      "      <missionMetaData>\n" +
      "        <missionid>70497d73-a7e4-4000-879a-feaf9099bfa1</missionid>\n" +
      "        <!--<description>U2 over</description>-->\n" +
      "        <!--<missionStatus>CLOSED</missionStatus>-->\n" +
      "        <!--<classification>Unclassified</classification>-->\n" +
      "        <!--<distrocontrol>FOUO</distrocontrol>-->\n" +
      "        <!--<atomissionnumber>HGZ3W09</atomissionnumber>-->\n" +
      "        <!--<atoday>aaa</atoday>-->\n" +
      "        <startdttime>12-12-2017T04:29:00.0Z</startdttime>\n" +
      "        <!--<enddttime>12-12-2017T04:29:00.0Z</enddttime>-->\n" +
      "        <!--<primaryorg>DGS-1</primaryorg>-->\n" +
      "        <!--<callsign>Spaceman</callsign>-->\n" +
      "        <!--<platform>U2</platform>-->\n" +
      "        <!--<tailnumber>NW1</tailnumber>-->\n" +
      "        <!--<missionstatickmllink>-->\n" +
      "          <!--http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=false-->\n" +
      "        <!--</missionstatickmllink>-->\n" +
      "        <!--<missiondynamickmllink>-->\n" +
      "          <!--http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=true-->\n" +
      "        <!--</missiondynamickmllink>-->\n" +
      "        <!--<unicornmissiondataurl>-->\n" +
      "          <!--http://codweb1.leidoshost.com/UNICORN.NET/pages/public/publiccustomerreport.aspx?strATO=HGZ3W09-->\n" +
      "        <!--</unicornmissiondataurl>-->\n" +
      "      </missionMetaData>\n" +
      "    </results>\n" +
      "  </GetMissionMetaDataResult>\n" +
      "</GetMissionMetaDataResponse>";


    GetMissionMetaDataResponse getMissionMetaDataResponse = JAXB.unmarshal(new StringSource(xml), GetMissionMetaDataResponse.class);

    GetMissionMetaDataResponse.GetMissionMetaDataResult getMissionMetaDataResult = getMissionMetaDataResponse.getGetMissionMetaDataResult();
    assertThat(getMissionMetaDataResult).isNotNull();

    System.out.println("getMissionMetaDataResult = " + getMissionMetaDataResult);

    assertThat(getMissionMetaDataResult.getResults().getMissionMetaData()).hasSize(1);
    Results.MissionMetaData missionMetaData = getMissionMetaDataResult.getResults().getMissionMetaData().get(0);
    System.out.println("missionMetaData.getMissionid() = " + missionMetaData.getMissionid());
    System.out.println("missionMetaData.getStartdttime() = " + missionMetaData.getStartdttime());

  }

  @Test
  public void test2() throws Exception {
    //language=XML
    String xml = "<results xmlns=\"\">\n" +
      "  <missionMetaData>\n" +
      "    <missionid>70497d73-a7e4-4000-879a-feaf9099bfa1</missionid>\n" +
      "    <!--<description>U2 over</description>-->\n" +
      "    <!--<missionStatus>CLOSED</missionStatus>-->\n" +
      "    <!--<classification>Unclassified</classification>-->\n" +
      "    <!--<distrocontrol>FOUO</distrocontrol>-->\n" +
      "    <!--<atomissionnumber>HGZ3W09</atomissionnumber>-->\n" +
      "    <!--<atoday>aaa</atoday>-->\n" +
      "    <startdttime>12-12-2017T04:29:00.0Z</startdttime>\n" +
      "    <!--<enddttime>12-12-2017T04:29:00.0Z</enddttime>-->\n" +
      "    <!--<primaryorg>DGS-1</primaryorg>-->\n" +
      "    <!--<callsign>Spaceman</callsign>-->\n" +
      "    <!--<platform>U2</platform>-->\n" +
      "    <!--<tailnumber>NW1</tailnumber>-->\n" +
      "    <!--<missionstatickmllink>-->\n" +
      "    <!--http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=false-->\n" +
      "    <!--</missionstatickmllink>-->\n" +
      "    <!--<missiondynamickmllink>-->\n" +
      "    <!--http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W09&amp;streaming=true-->\n" +
      "    <!--</missiondynamickmllink>-->\n" +
      "    <!--<unicornmissiondataurl>-->\n" +
      "    <!--http://codweb1.leidoshost.com/UNICORN.NET/pages/public/publiccustomerreport.aspx?strATO=HGZ3W09-->\n" +
      "    <!--</unicornmissiondataurl>-->\n" +
      "  </missionMetaData>\n" +
      "</results>";

    Results results = JAXB.unmarshal(new StringSource(xml), Results.class);

    assertThat(results.getMissionMetaData()).hasSize(1);
    String missionid = results.getMissionMetaData().get(0).getMissionid();
    System.out.println("missionid = " + missionid);
    XMLGregorianCalendar startdttime = results.getMissionMetaData().get(0).getStartdttime();
    System.out.println("startdttime = " + startdttime);


  }
}
