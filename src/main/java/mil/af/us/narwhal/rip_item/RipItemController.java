package mil.af.us.narwhal.rip_item;

import mil.af.us.narwhal.airman.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(RipItemController.URI)
public class RipItemController {
  public static final String URI = "/api/skill/rip-items";

  AirmanRepository airmanRepository;
  AirmanRipItemRepository airmanRipItemRepository;

  public RipItemController(AirmanRepository airmanRepository, AirmanRipItemRepository airmanRipItemRepository) {
    this.airmanRepository = airmanRepository;
    this.airmanRipItemRepository = airmanRipItemRepository;
  }

  @GetMapping(params = {"id"})
  public List<AirmanRipItem> index(@RequestParam("id") Long id) {
    Airman airman = airmanRepository.findOne(id);
    return airman.getRipItems();
  }

  @PutMapping
  public List<AirmanRipItem> update(@RequestBody List<AirmanRipItemJSON> airmanRipItemJSONS) {
    List<AirmanRipItem> airmanRipItems = airmanRipItemJSONS
      .stream()
      .map(airmanRipItemJSON ->
        new AirmanRipItem(
          airmanRipItemJSON.getId(),
          airmanRipItemJSON.getAirmanId(),
          airmanRipItemJSON.getRipItem(),
          airmanRipItemJSON.getExpirationDate()
        )).collect(Collectors.toList());
    return airmanRipItemRepository.save(airmanRipItems);
  }
}
