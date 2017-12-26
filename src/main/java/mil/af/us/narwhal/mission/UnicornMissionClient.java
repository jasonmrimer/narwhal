package mil.af.us.narwhal.mission;

import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;
import org.w3c.dom.Node;
import unicorn.GetMissionMetaData;
import unicorn.GetMissionMetaDataResponse;

import javax.xml.transform.dom.DOMSource;
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
  public List<MissionMetaData> getMissionMetaData() {
    GetMissionMetaData getMissionMetaData = new GetMissionMetaData();
    getMissionMetaData.setXmlRequest("");
    GetMissionMetaDataResponse response = (GetMissionMetaDataResponse) getWebServiceTemplate()
      .marshalSendAndReceive(getMissionMetaData, new SoapActionCallback("Unicorn/GetMissionMetaData"));

    Node result = (Node) response
      .getGetMissionMetaDataResult()
      .getContent()
      .get(0);
    Jaxb2Marshaller jaxb2Marshaller = new Jaxb2Marshaller();
    jaxb2Marshaller.setClassesToBeBound(Results.class);
    Results results = (Results) jaxb2Marshaller.unmarshal(new DOMSource(result));

    return results.getMissionMetaData();
  }
}
