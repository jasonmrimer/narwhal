package mil.af.us.narwhal.greeting;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class GreetingService {
    private GreetingRepository repository;

    public GreetingService(GreetingRepository repository) {
        this.repository = repository;
    }

    public Greeting getRandomGreeting() {
        List<Greeting> greetingsList = getGreetingsList();
        return greetingsList.get(new Random().nextInt(greetingsList.size()));
    }

    public List<Greeting> getGreetingsList() {
        return repository.findAll();
    }
}
