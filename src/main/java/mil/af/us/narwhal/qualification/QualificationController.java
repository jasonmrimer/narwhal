package mil.af.us.narwhal.qualification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
  @RequestMapping(QualificationController.URI)
public class QualificationController {
  public static final String URI = "/api/qualifications";

  @Autowired private QualificationRepository repository;

  @GetMapping
  public List<Qualification> index() {
    return repository.findAll();
  }

}
