package mil.af.us.narwhal.rip_item;

import mil.af.us.narwhal.airman.Airman;
import mil.af.us.narwhal.airman.AirmanRepository;
import mil.af.us.narwhal.airman.AirmanRipItem;
import mil.af.us.narwhal.airman.AirmanRipItemJSON;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping(RipItemController.URI)
public class RipItemController {
  public static final String URI = "/api/skill/rip-items";

  private AirmanRepository airmanRepository;

  public RipItemController(AirmanRepository airmanRepository) {
    this.airmanRepository = airmanRepository;
  }

  @GetMapping(params = {"id"})
  public List<AirmanRipItem> index(@RequestParam("id") Long id) {
    Airman airman = airmanRepository.findOne(id);
    return airman.getRipItems();
  }

  @PutMapping
  public List<AirmanRipItem> update(@RequestBody List<AirmanRipItemJSON> airmanRipItemJSONS) {
    return airmanRipItemJSONS
      .stream()
      .map(json -> {
        final Airman airman = airmanRepository.findOne(json.getAirmanId());
        final AirmanRipItem airmanRipItem = airman.updateRipItem(json.getId(), json.getExpirationDate());
        airmanRepository.save(airman);
        return airmanRipItem;
      })
      .collect(toList());
  }
}
