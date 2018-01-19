package mil.af.us.narwhal.airman;

import mil.af.us.narwhal.certification.Certification;
import mil.af.us.narwhal.event.Event;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.qualification.Qualification;
import mil.af.us.narwhal.squadron.Squadron;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@WebMvcTest(AirmanController.class)
@RunWith(SpringRunner.class)
public class AirmanControllerTest {
  private Squadron squadron;
  private Event event;
  private List<Airman> airmen;
  private Flight flight;
  @Autowired private MockMvc mockMvc;
  @MockBean private AirmanRepository airmanRepository;

  @Before
  public void setUp() {
    squadron = new Squadron(1L, 1L, "1", null);
    event = new Event(1L, "Dentist", "", Instant.parse("2007-12-03T10:15:30.00Z"), Instant.parse("2007-12-03T10:15:30.00Z"), 1L);
    Qualification qualification1 = new Qualification(1L, "Qual1", "qualification1");
    final AirmanQualification airQual = new AirmanQualification(1L, qualification1.getId(), new Date(), qualification1);

    Certification certification1 = new Certification(1L, "Certification 1");
    final AirmanCertification airCert = new AirmanCertification(1L, certification1.getId(), new Date(), certification1);

    flight = new Flight(1L, squadron.getId(), "SUPER FLIGHT");
    airmen = singletonList(
      new Airman(1L, flight.getId(), "FirstOne", "LastOne", singletonList(airQual), singletonList(airCert), singletonList(event))
    );
  }

  @Test
  public void index() throws Exception {
    when(airmanRepository.findAll()).thenReturn(airmen);

    mockMvc.perform(get(AirmanController.URI))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", Matchers.equalTo(1)))
      .andExpect(jsonPath("$[0].id").value(airmen.get(0).getId()))
      .andExpect(jsonPath("$[0].flightId").value(flight.getId()))
      .andExpect(jsonPath("[0].events", hasSize(1)));
  }

  @Test
  public void indexBySquadronId() throws Exception {
    when(airmanRepository.findBySquadronId(squadron.getId())).thenReturn(airmen);

    mockMvc.perform(get(AirmanController.URI).param("squadron", squadron.getId().toString()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", Matchers.equalTo(1)))
      .andExpect(jsonPath("$[0].id").value(airmen.get(0).getId()));
  }

  @Test
  public void indexByFlightId() throws Exception {
    when(airmanRepository.findByFlightId(flight.getId())).thenReturn(airmen);

    mockMvc.perform(get(AirmanController.URI).param("flight", flight.getId().toString()))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.size()", Matchers.equalTo(1)))
      .andExpect(jsonPath("$[0].id").value(airmen.get(0).getId()));
  }
}