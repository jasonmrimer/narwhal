package mil.af.us.narwhal.mission;

import generated.Results;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;
import unicorn.GetMissionMetaData;
import unicorn.GetMissionMetaDataResponse;

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
    GetMissionMetaData getMissionMetaData = new GetMissionMetaData();
    getMissionMetaData.setXmlRequest("");
    GetMissionMetaDataResponse response = (GetMissionMetaDataResponse) getWebServiceTemplate()
      .marshalSendAndReceive(getMissionMetaData, new SoapActionCallback("Unicorn/GetMissionMetaData"));

    return response.getGetMissionMetaDataResult().getResults().getMissionMetaData();
  }
}
