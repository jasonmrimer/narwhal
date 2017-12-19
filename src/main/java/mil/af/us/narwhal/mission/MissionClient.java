package mil.af.us.narwhal.mission;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.stereotype.Component;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;
import unicorn.GetMissionMetaData;
import unicorn.GetMissionMetaDataResponse;

@Component
public class MissionClient extends WebServiceGatewaySupport {

    private String unicornUri;

    public MissionClient(@Value("${unicorn-uri}") String unicornUri) {
        this.unicornUri = unicornUri;
    }

    @Override
    protected void initGateway() throws Exception {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setContextPath("unicorn");
        setMarshaller(marshaller);
        setUnmarshaller(marshaller);
        setDefaultUri(unicornUri);
    }

    public GetMissionMetaDataResponse getMissionMetaData() {
        GetMissionMetaData getMissionMetaData = new GetMissionMetaData();
        getMissionMetaData.setXmlRequest("");
        return (GetMissionMetaDataResponse) getWebServiceTemplate()
                .marshalSendAndReceive(getMissionMetaData, new SoapActionCallback("Unicorn/GetMissionMetaData"));
    }
}
