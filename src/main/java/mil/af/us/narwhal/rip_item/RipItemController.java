package mil.af.us.narwhal.rip_item;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(RipItemController.URI)
public class RipItemController {
  public static final String URI = "/api/skills/rip-items";

  RipItemRepository ripItemRepository;

  public RipItemController(RipItemRepository ripItemRepository) {
    this.ripItemRepository = ripItemRepository;
  }

  @GetMapping
  public List<RipItem> index() {
    return ripItemRepository.findAll();
  }
}
