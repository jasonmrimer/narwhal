package mil.af.us.narwhal.airman;

import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.rank.Rank;
import mil.af.us.narwhal.rank.RankRepository;
import mil.af.us.narwhal.schedule.Schedule;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AirmanServiceTest {
  @Mock private AirmanRepository airmanRepository;
  @Mock private FlightRepository flightRepository;
  @Mock private RankRepository rankRepository;
  private AirmanService subject;

  @Before
  public void setUp() {
    subject = new AirmanService(airmanRepository, flightRepository, rankRepository);
  }

  @Test
  public void testGetAirman() {
    final Airman airman = new Airman();
    airman.setId(123L);

    when(airmanRepository.findOne(airman.getId()))
      .thenReturn(airman);

    assertThat(subject.getAirman(123L)).isEqualTo(airman);
  }

  @Test
  public void testGetAirmenBySite() {
    final Airman airman1 = new Airman();
    airman1.setId(123L);

    final Airman airman2 = new Airman();
    airman1.setId(456L);

    final List<Airman> airmen = asList(airman1, airman2);

    when(airmanRepository.findAllBySiteIdAndByOrderByLastName(789L))
      .thenReturn(airmen);

    assertThat(subject.getAirmenBySite(789L)).isEqualTo(airmen);
  }

  @Test
  public void testUpdateAirman() {
    final Flight flight1 = new Flight();
    flight1.setId(1L);

    final Flight flight2 = new Flight();
    flight2.setId(2L);

    final Rank rank = new Rank();
    rank.setId(3L);

    final Airman airman = new Airman();
    airman.setId(123L);
    airman.setFirstName("A");
    airman.setLastName("B");
    airman.setShift(ShiftType.Night);
    airman.setFlight(flight1);

    final AirmanSchedule airmanSchedule = new AirmanSchedule(
      airman,
      new Schedule("Back Half", false, false, false, false, true, true, true),
      Instant.now()
    );

    when(airmanRepository.findOne(123L))
      .thenReturn(airman);

    when(flightRepository.findOne(2L))
      .thenReturn(flight2);

    when(rankRepository.findOne(3L))
      .thenReturn(rank);

    when(airmanRepository.save(any(Airman.class)))
      .thenAnswer((Answer<Airman>) invocation -> (Airman) invocation.getArguments()[0]);

    final AirmanJSON json = new AirmanJSON(
      123L,
      2L,
      "Foo",
      "Bar",
      "Foo knows Travis",
      rank,
      ShiftType.Day,
      new ArrayList<>(),
      new ArrayList<>(),
      singletonList(airmanSchedule),
      new ArrayList<>()
    );

    Airman savedAirman = subject.updateAirman(json);

    assertThat(savedAirman.getId()).isEqualTo(123L);
    assertThat(savedAirman.getFirstName()).isEqualTo("Foo");
    assertThat(savedAirman.getLastName()).isEqualTo("Bar");
    assertThat(savedAirman.getRemarks()).isEqualTo("Foo knows Travis");
    assertThat(savedAirman.getShift()).isEqualTo(ShiftType.Day);
    assertThat(savedAirman.getFlight().getId()).isEqualTo(flight2.getId());
    assertThat(savedAirman.getRank().getId()).isEqualTo(rank.getId());
    assertThat(savedAirman.getSchedules()).containsExactly(airmanSchedule);
  }

  @Test
  public void testCreateAirman() {
    final Flight flight = new Flight();
    flight.setId(1L);

    final Rank rank = new Rank();
    rank.setId(1L);

    final AirmanSchedule airmanSchedule = new AirmanSchedule(
      null,
      new Schedule("Back Half", false, false, false, false, true, true, true),
      Instant.now()
    );

    when(flightRepository.findOne(1L))
      .thenReturn(flight);

    when(rankRepository.findOne(1L))
      .thenReturn(rank);

    when(airmanRepository.save(any(Airman.class)))
      .thenAnswer((Answer<Airman>) invocation -> {
        final Airman airman = (Airman) invocation.getArguments()[0];
        airman.setId(123L);
        return airman;
      });

    final AirmanJSON json = new AirmanJSON(
      null,
      1L,
      "Foo",
      "Bar",
      "Foo does not know what day it is",
      rank,
      ShiftType.Day,
      new ArrayList<>(),
      new ArrayList<>(),
      singletonList(airmanSchedule),
      new ArrayList<>()
    );

    Airman savedAirman = subject.createAirman(json);

    assertThat(savedAirman.getId()).isNotNull();
    assertThat(savedAirman.getFirstName()).isEqualTo("Foo");
    assertThat(savedAirman.getLastName()).isEqualTo("Bar");
    assertThat(savedAirman.getRemarks()).isEqualTo("Foo does not know what day it is");
    assertThat(savedAirman.getShift()).isEqualTo(ShiftType.Day);
    assertThat(savedAirman.getFlight().getId()).isEqualTo(flight.getId());
    assertThat(savedAirman.getRank().getId()).isEqualTo(rank.getId());
    assertThat(savedAirman.getSchedules()).containsExactly(airmanSchedule);
  }

  @Test
  public void testDeleteAirman() {
    subject.deleteAirman(123L);
    verify(airmanRepository).delete(123L);
  }
}
