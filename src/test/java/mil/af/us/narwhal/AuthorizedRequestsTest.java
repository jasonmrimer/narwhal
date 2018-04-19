package mil.af.us.narwhal;

import mil.af.us.narwhal.profile.RoleName;
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

import java.io.Serializable;
import java.util.*;

import static java.util.Arrays.asList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles(profiles = {"cloud", "test"})
@SpringBootTest
@RunWith(SpringRunner.class)
public class AuthorizedRequestsTest {
  @Autowired private WebApplicationContext webAppContext;
  private MockMvc mockMvc;

  @Before
  public void setUp() {
    mockMvc = MockMvcBuilders
      .webAppContextSetup(webAppContext)
      .apply(springSecurity())
      .build();
  }

  @Test
  public void testAdminProtectedRoutes() throws Exception {
    List<Object[]> getRequests = asList(new Object[][]{
      {"/api/profiles", RoleName.ADMIN, 200},
      {"/api/profiles", RoleName.READER, 403},
      {"/api/profiles", RoleName.WRITER, 403},
    });

    for (Object[] req : getRequests) {
      mockMvc.perform(MockMvcRequestBuilders.get((String) req[0])
        .with(authentication(getOauthGoodTestAuthentication((RoleName) req[1])))
        .sessionAttr("scopedTarget.oauth2ClientContext", getOauth2ClientContext()))
        .andExpect(status().is((int) req[2]));
    }
  }

  private Authentication getOauthGoodTestAuthentication(RoleName roleName) {
    return new OAuth2Authentication(getOauth2Request(roleName), getGoodAuthentication(roleName));
  }

  private OAuth2Request getOauth2Request(RoleName roleName) {
    String clientId = "oauth-client-id";
    Map<String, String> requestParameters = Collections.emptyMap();
    boolean approved = true;
    String redirectUrl = "http://url-does-not-matter.com";
    Set<String> responseTypes = Collections.emptySet();
    Set<String> scopes = Collections.emptySet();
    Set<String> resourceIds = Collections.emptySet();
    Map<String, Serializable> extensionProperties = Collections.emptyMap();
    List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_" + roleName.name());

    OAuth2Request oAuth2Request = new OAuth2Request(requestParameters, clientId, authorities,
      approved, scopes, resourceIds, redirectUrl, responseTypes, extensionProperties);

    return oAuth2Request;
  }

  private Authentication getGoodAuthentication(RoleName roleName) {
    List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_" + roleName.name());

    HashMap<String, String> details = new HashMap<>();
    details.put("user_name", "tytus");

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
