package mil.af.us.narwhal.mission;

import generated.Results;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;
import unicorn.GetMissionMetaDataRestV2;
import unicorn.GetMissionMetaDataRestV2Response;

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
    GetMissionMetaDataRestV2 getMissionMetaData = new GetMissionMetaDataRestV2();
    getMissionMetaData.setStart("03/01/2018");
    getMissionMetaData.setEnd("04/01/2018");
    GetMissionMetaDataRestV2Response response = (GetMissionMetaDataRestV2Response) getWebServiceTemplate()
      .marshalSendAndReceive(getMissionMetaData, new SoapActionCallback("Unicorn/GetMissionMetaDataRestV2"));

    return response.getGetMissionMetaDataRestV2Result().getResults().getMissionMetaData();
  }
}
