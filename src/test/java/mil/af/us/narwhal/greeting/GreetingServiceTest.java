package mil.af.us.narwhal.greeting;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.List;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class GreetingServiceTest {
    @Mock GreetingRepository repository;
    GreetingService subject;

    @Before
    public void setUp() throws Exception {
        subject = new GreetingService(repository);
    }

    @Test
    public void getGreetingTest() {
        when(repository.findAll())
                .thenReturn(asList(
                        new Greeting(1L, "A"),
                        new Greeting(2L, "B"),
                        new Greeting(3L, "C")
                ));
        final List listOfGreetings = subject.getGreetingsList();
        assertThat(listOfGreetings).contains(subject.getRandomGreeting());
    }
}