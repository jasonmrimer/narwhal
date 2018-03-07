package mil.af.us.narwhal.mission;

import generated.Results;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;
import unicorn.GetMissionMetaDataRestV2;
import unicorn.GetMissionMetaDataRestV2Response;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

public class UnicornMissionClient extends WebServiceGatewaySupport implements MissionClient {
  private String unicornUri;

  public UnicornMissionClient(String unicornUri) {
    this.unicornUri = unicornUri;
  }

  @Override
  protected void initGateway() {
    Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
    marshaller.setContextPath("unicorn");
    setMarshaller(marshaller);
    setUnmarshaller(marshaller);
    setDefaultUri(unicornUri);
  }

  @Override
  public List<Results.MissionMetaData> getMissionMetaData() {
    SimpleDateFormat format1 = new SimpleDateFormat("MM/dd/yyyy");
    Calendar cal = Calendar.getInstance();
    String startDate = format1.format(cal.getTime());
    cal.add(Calendar.DAY_OF_YEAR, 14);
    String endDate = format1.format(cal.getTime());

    GetMissionMetaDataRestV2 getMissionMetaData = new GetMissionMetaDataRestV2();
    getMissionMetaData.setStart(startDate);
    getMissionMetaData.setEnd(endDate);
    GetMissionMetaDataRestV2Response response = (GetMissionMetaDataRestV2Response) getWebServiceTemplate()
      .marshalSendAndReceive(getMissionMetaData, new SoapActionCallback("Unicorn/GetMissionMetaDataRestV2"));

    return response.getGetMissionMetaDataRestV2Result().getResults().getMissionMetaData();
  }
}
