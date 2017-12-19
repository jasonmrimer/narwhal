package mil.af.us.narwhal.mission;

import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.stereotype.Component;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;
import unicorn.GetMissionMetaData;
import unicorn.GetMissionMetaDataResponse;

@Component
public class MissionClient extends WebServiceGatewaySupport {

    public GetMissionMetaDataResponse getMissionMetaDataResponse() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setContextPath("unicorn");

        this.setMarshaller(marshaller);
        this.setUnmarshaller(marshaller);

        GetMissionMetaData request = new GetMissionMetaData();
        request.setXmlRequest("");
        return (GetMissionMetaDataResponse)this.getWebServiceTemplate().marshalSendAndReceive("http://codweb1.leidoshost.com/UNICORN.NET/WebServices/UnicornMissionWebservicesV2.asmx", request, new SoapActionCallback("Unicorn/GetMissionMetaData"));
    }
}
