package mil.af.us.narwhal.mission;

import generated.Results;
import org.springframework.xml.transform.StringSource;
import unicorn.GetMissionMetaDataResponse;

import javax.xml.bind.JAXB;
import java.util.List;

public class MissionClientStub implements MissionClient {
  //language=XML
  public static final String RESPONSE = "<GetMissionMetaDataResponse xmlns=\"Unicorn\">\n" +
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
    "      <missionMetaData>\n" +
    "        <missionid>929e9a89-b8a1-493d-a69c-e0836e719f78</missionid>\n" +
    "        <description>U-2 over </description>\n" +
    "        <missionStatus>CLOSED</missionStatus>\n" +
    "        <classification>Unclassified</classification>\n" +
    "        <distrocontrol>FOUO</distrocontrol>\n" +
    "        <atomissionnumber>HGZ3W08</atomissionnumber>\n" +
    "        <atoday>aaa</atoday>\n" +
    "        <startdttime>12-12-2017T09:00:00.0Z</startdttime>\n" +
    "        <enddttime>12-12-2017T12:00:00.0Z</enddttime>\n" +
    "        <primaryorg>DGS-2</primaryorg>\n" +
    "        <callsign>Spaceman</callsign>\n" +
    "        <platform>U-2</platform>\n" +
    "        <tailnumber>\n" +
    "        </tailnumber>\n" +
    "        <missionstatickmllink>http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W08&amp;streaming=false</missionstatickmllink>\n" +
    "        <missiondynamickmllink>http://codweb1.leidoshost.com/UNICORN.NET/webservices/googleearth.asmx/getkmzformissionbyato?ato=HGZ3W08&amp;streaming=true</missiondynamickmllink>\n" +
    "        <unicornmissiondataurl>http://codweb1.leidoshost.com/UNICORN.NET/pages/public/publiccustomerreport.aspx?strATO=HGZ3W08</unicornmissiondataurl>\n" +
    "      </missionMetaData>\n" +
    "    </results>\n" +
    "  </GetMissionMetaDataResult>\n" +
    "</GetMissionMetaDataResponse>";

  @Override
  public List<Results.MissionMetaData> getMissionMetaData() {
    GetMissionMetaDataResponse getMissionMetaDataResponse = JAXB.unmarshal(new StringSource(RESPONSE), GetMissionMetaDataResponse.class);
    return getMissionMetaDataResponse.getGetMissionMetaDataResult().getResults().getMissionMetaData();
  }
}


