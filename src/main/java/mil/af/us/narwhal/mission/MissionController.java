package mil.af.us.narwhal.mission;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(MissionController.URI)
public class MissionController {
    public static final String URI = "/api/missions";
    MissionRepository repository;

    public MissionController(MissionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Mission> index() {
        return repository.findAll();
    }
}
