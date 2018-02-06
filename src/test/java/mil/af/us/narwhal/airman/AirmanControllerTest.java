package mil.af.us.narwhal.airman;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.event.EventType;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.skills.Certification;
import mil.af.us.narwhal.skills.Qualification;
import mil.af.us.narwhal.squadron.Squadron;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(AirmanController.class)
@RunWith(SpringRunner.class)
public class AirmanControllerTest {
  private final static ObjectMapper objectMapper = new ObjectMapper();
  private final static JavaTimeModule module = new JavaTimeModule();

  @Autowired private MockMvc mockMvc;
  @MockBean private AirmanRepository repository;
  @Captor private ArgumentCaptor<Airman> captor;
  private Squadron squadron;
  private Flight flight;
  private List<Airman> airmen;

  static {
    objectMapper.registerModule(module);
  }

  @Before
  public void setUp() {
    squadron = new Squadron(1L, 1L, "1");
    flight = new Flight(1L, squadron.getId(), "SUPER FLIGHT");

    final Event event = new Event(1L, "Dentist", "", Instant.now(), Instant.now(), EventType.APPOINTMENT, 1L);

    final Qualification qualification = new Qualification(1L, "Qual1", "qualification");
    final AirmanQualification airQual = new AirmanQualification(100L, 1L, qualification, new Date(), new Date());

    final Certification certification = new Certification(1L, "Certification 1");
    final AirmanCertification airCert = new AirmanCertification(200L, 1L, certification, new Date(), new Date());

    airmen = singletonList(new Airman(
      1L,
      flight.getId(),
      "FirstOne",
      "LastOne",
      singletonList(airQual),
      singletonList(airCert),
      singletonList(event)
    ));
  }

  @Test
  public void index() throws Exception {
    when(repository.findAll()).thenReturn(airmen);

    mockMvc.perform(get(AirmanController.URI))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", Matchers.equalTo(1)))
      .andExpect(jsonPath("$[0].id").value(airmen.get(0).getId()))
      .andExpect(jsonPath("$[0].flightId").value(flight.getId()))
      .andExpect(jsonPath("[0].events", hasSize(1)));
  }

  @Test
  public void indexBySquadronId() throws Exception {
    when(repository.findBySquadronId(squadron.getId())).thenReturn(airmen);

    mockMvc.perform(get(AirmanController.URI).param("squadron", squadron.getId().toString()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", Matchers.equalTo(1)))
      .andExpect(jsonPath("$[0].id").value(airmen.get(0).getId()));
  }

  @Test
  public void indexByFlightId() throws Exception {
    when(repository.findByFlightId(flight.getId())).thenReturn(airmen);

    mockMvc.perform(get(AirmanController.URI).param("flight", flight.getId().toString()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", Matchers.equalTo(1)))
      .andExpect(jsonPath("$[0].id").value(airmen.get(0).getId()));
  }

  @Test
  public void createAirmanQualification() throws Exception {
    final Airman airman = airmen.get(0);
    when(repository.findOne(airman.getId())).thenReturn(airman);

    final AirmanQualification qualification = new AirmanQualification(1L, new Qualification(), new Date(), new Date());
    final String json = objectMapper.writeValueAsString(qualification);

    mockMvc.perform(
      post(AirmanController.URI + "/" + airman.getId() + "/qualifications")
        .content(json)
        .contentType(MediaType.APPLICATION_JSON)
        .with(httpBasic("tytus", "password")))
      .andExpect(status().isCreated());

    verify(repository).save(airman);
  }

  @Test
  public void createAirmanCertification() throws Exception {
    final Airman airman = airmen.get(0);
    when(repository.findOne(airman.getId())).thenReturn(airman);

    final AirmanCertification certification = new AirmanCertification(1L, new Certification(), new Date(), new Date());
    final String json = objectMapper.writeValueAsString(certification);

    mockMvc.perform(
      post(AirmanController.URI + "/" + airman.getId() + "/certifications")
        .content(json)
        .contentType(MediaType.APPLICATION_JSON)
        .with(httpBasic("tytus", "password")))
      .andExpect(status().isCreated());

    verify(repository).save(airman);
  }

  @Test
  public void updateAirmanQualification() throws Exception {
    final Airman airman = airmen.get(0);
    when(repository.findOne(airman.getId())).thenReturn(airman);

    final Date newExpirationDate = new Date();
    final AirmanQualification qualification = airman.getQualifications().get(0);
    qualification.setExpirationDate(newExpirationDate);

    final String json = objectMapper.writeValueAsString(qualification);

    mockMvc.perform(
      put(AirmanController.URI + "/" + airman.getId() + "/qualifications")
        .content(json)
        .contentType(MediaType.APPLICATION_JSON)
        .with(httpBasic("tytus", "password")))
      .andExpect(status().isOk());

    verify(repository).save(captor.capture());
    assertThat(captor.getValue().getQualifications().get(0).getExpirationDate()).isEqualTo(newExpirationDate);
  }

  @Test
  public void updateAirmanCertification() throws Exception {
    final Airman airman = airmen.get(0);
    when(repository.findOne(airman.getId())).thenReturn(airman);

    final Date newExpirationDate = new Date();
    final AirmanCertification certification = airman.getCertifications().get(0);
    certification.setExpirationDate(newExpirationDate);

    final String json = objectMapper.writeValueAsString(certification);

    mockMvc.perform(
      put(AirmanController.URI + "/" + airman.getId() + "/certifications")
        .content(json)
        .contentType(MediaType.APPLICATION_JSON)
        .with(httpBasic("tytus", "password")))
      .andExpect(status().isOk());

    verify(repository).save(captor.capture());
    assertThat(captor.getValue().getCertifications().get(0).getExpirationDate()).isEqualTo(newExpirationDate);
  }

}