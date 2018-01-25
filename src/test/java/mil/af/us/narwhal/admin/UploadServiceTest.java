package mil.af.us.narwhal.admin;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.flight.Flight;
import mil.af.us.narwhal.flight.FlightRepository;
import mil.af.us.narwhal.site.Site;
import mil.af.us.narwhal.site.SiteRepository;
import mil.af.us.narwhal.squadron.Squadron;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import java.util.List;
import java.util.Set;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UploadServiceTest {
  private final Flight flight = new Flight(1L, 1L, "FLIGHT1");
  private final Squadron squadron = new Squadron(1L, 1L, "SQUAD1", singletonList(flight));
  private final Site site = new Site(1L, "SITE1", singletonList(squadron));
  @Mock private AirmanRepository airmanRepository;
  @Mock private SiteRepository siteRepository;
  @Mock private FlightRepository flightRepository;
  @Captor private ArgumentCaptor<Set<Airman>> airmenCaptor;
  private UploadService subject;

  @Before
  public void setUp() {
    when(siteRepository.findOneByName(site.getName())).thenReturn(site);
    subject = new UploadService(airmanRepository, siteRepository, flightRepository);
  }

  @Test
  public void testImportToDatabase() {
    final List<UploadCSVRow> rows = asList(
      new UploadCSVRow("first1", "last1", site.getName(), squadron.getName(), flight.getName()),
      new UploadCSVRow("first2", "last2", site.getName(), squadron.getName(), flight.getName()),
      new UploadCSVRow("first3", "last3", site.getName(), squadron.getName(), flight.getName())
    );
    subject.importToDatabase(rows);
    verify(airmanRepository).save(airmenCaptor.capture());
    assertThat(airmenCaptor.getValue()).containsExactlyInAnyOrder(
      new Airman(flight.getId(), "first1", "last1"),
      new Airman(flight.getId(), "first2", "last2"),
      new Airman(flight.getId(), "first3", "last3")
    );
  }

  @Test
  public void testImportToDatabase_createsUnknownFlights() {
    final Long flightId = 123L;
    when(flightRepository.save(any(Flight.class)))
      .thenAnswer((Answer<Flight>) invocation -> {
        Flight flight = invocation.getArgumentAt(0, Flight.class);
        flight.setId(flightId);
        return flight;
      });

    final List<UploadCSVRow> rows = singletonList(
      new UploadCSVRow("first1", "last1", site.getName(), squadron.getName(), "FLIGHT2")
    );
    subject.importToDatabase(rows);

    verify(airmanRepository).save(airmenCaptor.capture());
    assertThat(airmenCaptor.getValue()).containsExactlyInAnyOrder(new Airman(flightId, "first1", "last1"));
  }

  @Test
  public void testImportToDatabase_doesNotCreateUnknownSites() {
    subject.importToDatabase(singletonList(new UploadCSVRow("first1", "last1", "unknown-site", "", "")));
    verifyZeroInteractions(airmanRepository);
    verifyZeroInteractions(flightRepository);
  }

  @Test
  public void testImportToDatabase_doesNotCreateUnknownSquadrons() {
    subject.importToDatabase(singletonList(new UploadCSVRow("first1", "last1", site.getName(), "unknown-squadron", "")));
    verifyZeroInteractions(airmanRepository);
    verifyZeroInteractions(flightRepository);
  }
}