package mil.af.us.narwhal;

import mil.af.us.narwhal.config.EndpointAuthorizationExpectations;
import mil.af.us.narwhal.profile.RoleName;
import org.hamcrest.Matchers;
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

import javax.servlet.Filter;
import java.io.Serializable;
import java.util.*;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles(profiles = {"cloud", "test"})
@SpringBootTest
@RunWith(SpringRunner.class)
public class AuthorizedRequestsTest {
  public static final List<RoleName> NoneAdmins = Arrays.asList(RoleName.READER, RoleName.WRITER);
  public static final List<RoleName> NoneViewers = Arrays.asList(RoleName.ADMIN, RoleName.WRITER);
  public static final List<RoleName> Everyone = Arrays.asList(RoleName.READER, RoleName.WRITER, RoleName.ADMIN);
  public static final List<RoleName> Admins = Arrays.asList(RoleName.ADMIN);
  public static final List<RoleName> Viewers = Arrays.asList(RoleName.READER);
  private static final Boolean Authorized = true;
  private static final Boolean Unauthorized = false;
  @Autowired
  private WebApplicationContext webAppContext;
  @Autowired
  private Filter springSecurityFilterChain;
  private MockMvc mockMvc;
  private List<EndpointAuthorizationExpectations> expectations;
  private HashMap<Boolean, List<RoleName>> adminOnly;
  private HashMap<Boolean, List<RoleName>> modifiersOnly;
  private HashMap<Boolean, List<RoleName>> everyone;

  @Before
  public void setUp() {
    mockMvc = MockMvcBuilders
      .webAppContextSetup(webAppContext)
      .apply(springSecurity())
      .addFilters(springSecurityFilterChain, new ShortCircuitFilter())
      .build();


    adminOnly = new HashMap<Boolean, List<RoleName>>() {{
      put(Authorized, Admins);
      put(Unauthorized, NoneAdmins);
    }};

    modifiersOnly = new HashMap<Boolean, List<RoleName>>() {{
      put(Authorized, NoneViewers);
      put(Unauthorized, Viewers);
    }};

    everyone = new HashMap<Boolean, List<RoleName>>() {{
      put(Authorized, Everyone);
    }};

    expectations =
      Arrays.asList(
        new EndpointAuthorizationExpectations("/api/airmen")
          .setStatusCodeDictionaryPOST(modifiersOnly)
          .setStatusCodeDictionaryPUT(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/airmen/1")
          .setStatusCodeDictionaryDELETE(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/airmen/1/certifications/1")
          .setStatusCodeDictionaryDELETE(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/airmen/1/certifications")
          .setStatusCodeDictionaryPOST(modifiersOnly)
          .setStatusCodeDictionaryPUT(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/events")
          .setStatusCodeDictionaryPOST(everyone)
        , new EndpointAuthorizationExpectations("/api/events/pending")
          .setStatusCodeDictionaryGET(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/airmen/1/qualifications")
          .setStatusCodeDictionaryPOST(modifiersOnly)
          .setStatusCodeDictionaryPUT(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/airmen/1/qualifications/1")
          .setStatusCodeDictionaryDELETE(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/flights")
          .setStatusCodeDictionaryPOST(modifiersOnly)
        ,new EndpointAuthorizationExpectations("/api/flights/1")
          .setStatusCodeDictionaryDELETE(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/crew_positions")
          .setStatusCodeDictionaryDELETE(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/crew_positions/1")
          .setStatusCodeDictionaryPUT(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/crews/1/airmen/1")
          .setStatusCodeDictionaryDELETE(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/events/1")
          .setStatusCodeDictionaryDELETE(everyone)
          .setStatusCodeDictionaryPUT(everyone)
        , new EndpointAuthorizationExpectations("/api/profiles")
          .setStatusCodeDictionaryGET(adminOnly)
          .setStatusCodeDictionaryPUT(adminOnly)
        , new EndpointAuthorizationExpectations("/api/profiles/me")
          .setStatusCodeDictionaryPUT(everyone)
          .setStatusCodeDictionaryDELETE(everyone)
        , new EndpointAuthorizationExpectations("/api/skill/rip-items")
          .setStatusCodeDictionaryPUT(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/upload/airmen")
          .setStatusCodeDictionaryPOST(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/upload/airmen/certifications")
          .setStatusCodeDictionaryPOST(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/upload/airmen/qualifications")
          .setStatusCodeDictionaryPOST(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/upload/certifications")
          .setStatusCodeDictionaryPOST(modifiersOnly)
        , new EndpointAuthorizationExpectations("/api/upload/qualifications")
          .setStatusCodeDictionaryPOST(modifiersOnly)
      );
  }

  @Test
  public void testAdminProtectedRoutes() throws Exception {
    for (EndpointAuthorizationExpectations expectation : expectations) {
      testGET(expectation);
      testPUT(expectation);
      testPOST(expectation);
      testDELETE(expectation);
    }
  }

  private void testDELETE(EndpointAuthorizationExpectations expectation) throws Exception {
    for (Map.Entry<Boolean, List<RoleName>> entry : expectation.getStatusCodeDictionaryDELETE().entrySet()) {
      for (RoleName roleName : entry.getValue()) {
        testExpectationDELETE(expectation, entry, roleName);
      }
    }
  }

  private void testGET(EndpointAuthorizationExpectations expectation) throws Exception {
    for (Map.Entry<Boolean, List<RoleName>> entry : expectation.getStatusCodeDictionaryGET().entrySet()) {
      for (RoleName roleName : entry.getValue()) {
        testExpectationGET(expectation, entry, roleName);
      }
    }
  }

  private void testPOST(EndpointAuthorizationExpectations expectation) throws Exception {
    for (Map.Entry<Boolean, List<RoleName>> entry : expectation.getStatusCodeDictionaryPOST().entrySet()) {
      for (RoleName roleName : entry.getValue()) {
        testExpectationPOST(expectation, entry, roleName);
      }
    }
  }

  private void testPUT(EndpointAuthorizationExpectations expectation) throws Exception {
    for (Map.Entry<Boolean, List<RoleName>> entry : expectation.getStatusCodeDictionaryPUT().entrySet()) {
      for (RoleName roleName : entry.getValue()) {
        testExpectationPUT(expectation, entry, roleName);
      }
    }
  }

  private void testExpectationDELETE(EndpointAuthorizationExpectations expectation, Map.Entry<Boolean, List<RoleName>> entry, RoleName roleName) throws Exception {
    Boolean isSuccess = entry.getKey();

    mockMvc.perform(MockMvcRequestBuilders.delete(expectation.getUrl())
      .with(authentication(getOauthGoodTestAuthentication(roleName)))
      .with(csrf())
      .sessionAttr("scopedTarget.oauth2ClientContext", getOauth2ClientContext()))
      .andExpect(isSuccess ? status().is(Matchers.not(403)) : status().is(403));
  }

  private void testExpectationGET(EndpointAuthorizationExpectations expectation, Map.Entry<Boolean, List<RoleName>> entry, RoleName roleName) throws Exception {
    Boolean isSuccess = entry.getKey();

    mockMvc.perform(MockMvcRequestBuilders.get(expectation.getUrl())
      .with(authentication(getOauthGoodTestAuthentication(roleName)))
      .sessionAttr("scopedTarget.oauth2ClientContext", getOauth2ClientContext()))
      .andExpect(isSuccess ? status().is(Matchers.not(403)) : status().is(403));
  }

  private void testExpectationPOST(EndpointAuthorizationExpectations expectation, Map.Entry<Boolean, List<RoleName>> entry, RoleName roleName) throws Exception {
    Boolean isSuccess = entry.getKey();

    mockMvc.perform(
      MockMvcRequestBuilders
        .post(expectation.getUrl())
        .with(csrf())
        .with(authentication(getOauthGoodTestAuthentication(roleName)))
        .sessionAttr("scopedTarget.oauth2ClientContext", getOauth2ClientContext()))
      .andExpect(isSuccess ? status().is(Matchers.not(403)) : status().is(403));
  }

  private void testExpectationPUT(EndpointAuthorizationExpectations expectation, Map.Entry<Boolean, List<RoleName>> entry, RoleName roleName) throws Exception {
    Boolean isSuccess = entry.getKey();

    mockMvc.perform(
      MockMvcRequestBuilders
        .put(expectation.getUrl())
        .with(csrf())
        .with(authentication(getOauthGoodTestAuthentication(roleName)))
        .sessionAttr("scopedTarget.oauth2ClientContext", getOauth2ClientContext()))
      .andExpect(isSuccess ? status().is(Matchers.not(403)) : status().is(403));
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
