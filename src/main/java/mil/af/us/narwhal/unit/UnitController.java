package mil.af.us.narwhal.unit;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(UnitController.URI)
public class UnitController {
  public static final String URI = "/api/units";

  UnitRepository unitRepository;

  public UnitController(UnitRepository unitRepository) {
    this.unitRepository = unitRepository;
  }

  @GetMapping
  public List<Unit> index() {
    return unitRepository.findAll();
  }
}
