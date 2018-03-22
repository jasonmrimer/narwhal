package mil.af.us.narwhal;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Serializable;
import java.util.*;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.logging.StreamHandler;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@ActiveProfiles(profiles = {"cloud", "test"})
@SpringBootTest
@RunWith(SpringRunner.class)
public class ApplicationLogListenerTest {
  private static Logger logger = Logger.getLogger(ApplicationLogListener.class.getName());
  private static OutputStream logCapturingStream;
  private static StreamHandler captureHandler;

  @Autowired private WebApplicationContext webAppContext;
  private MockMvc mockMvc;

  @Before
  public void attachLogCaptureHandler() {
    logCapturingStream = new ByteArrayOutputStream();
    captureHandler = new StreamHandler(logCapturingStream, new SimpleFormatter());
    logger.addHandler(captureHandler);
    mockMvc = MockMvcBuilders
      .webAppContextSetup(webAppContext)
      .apply(springSecurity())
      .build();
  }

  public String getTestCapturedLog() throws IOException {
    captureHandler.flush();
    return logCapturingStream.toString();
  }

  @Test
  public void onApplicationEvent_logsAuthorizationFailureAndAuditApplicationEventsToConsole() throws Exception {
    final String expectedAuthFailure = "Event Occurred : org.springframework.security.access.event.AuthorizationFailureEvent";
    final String expectedAuditEvent = "Event Occurred : org.springframework.boot.actuate.audit.listener.AuditApplicationEvent";

    mockMvc.perform(MockMvcRequestBuilders.get("/api/initial-load-data-bundle"));

    String capturedLog = getTestCapturedLog();

    assertThat(capturedLog.contains(expectedAuthFailure)).isEqualTo(true);
    assertThat(capturedLog.contains(expectedAuditEvent)).isEqualTo(true);
  }

  @Test
  public void onApplicationEvent_logsServletRequestHandledEventToConsole() throws Exception {
    final String expectedRequestEvent = "Event Occurred : ServletRequestHandledEvent";

    mockMvc.perform(MockMvcRequestBuilders.get("/api/initial-load-data-bundle")
      .with(authentication(getOauthGoodTestAuthentication()))
      .sessionAttr("scopedTarget.oauth2ClientContext", getOauth2ClientContext()));

    String capturedLog = getTestCapturedLog();

    assertThat(capturedLog.contains(expectedRequestEvent)).isEqualTo(true);
  }

  private Authentication getOauthGoodTestAuthentication() {
    return new OAuth2Authentication(getOauth2Request(), getGoodAuthentication());
  }

  private OAuth2Request getOauth2Request() {
    String clientId = "oauth-client-id";
    Map<String, String> requestParameters = Collections.emptyMap();
    boolean approved = true;
    String redirectUrl = "http://url-really-does-not-matter.com";
    Set<String> responseTypes = Collections.emptySet();
    Set<String> scopes = Collections.emptySet();
    Set<String> resourceIds = Collections.emptySet();
    Map<String, Serializable> extensionProperties = Collections.emptyMap();
    List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("SOME-ROLE");

    OAuth2Request oAuth2Request = new OAuth2Request(requestParameters, clientId, authorities,
      approved, scopes, resourceIds, redirectUrl, responseTypes, extensionProperties);

    return oAuth2Request;
  }

  private Authentication getGoodAuthentication() {
    List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("SOME-ROLE");

    HashMap<String, String> details = new HashMap<>();
    details.put("username", "tytus");

    TestingAuthenticationToken token = new TestingAuthenticationToken(null, null, authorities);
    token.setAuthenticated(true);
    token.setDetails(details);

    return token;
  }

  private OAuth2ClientContext getOauth2ClientContext() {
    OAuth2ClientContext mockClient = mock(OAuth2ClientContext.class);
    when(mockClient.getAccessToken()).thenReturn(new DefaultOAuth2AccessToken("my-fun-token"));

    return mockClient;
  }
}
