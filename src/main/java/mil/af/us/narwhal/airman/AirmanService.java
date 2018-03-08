package mil.af.us.narwhal.airman;

import org.springframework.stereotype.Service;

@Service
public class AirmanService {
  Airman buildAirmanFromJSON(AirmanJSON airmanJSON) {
    Airman airman = new Airman();
    airman.setId(airmanJSON.getId());
    airman.setFlightId(airmanJSON.getFlightId());
    airman.setFirstName(airmanJSON.getFirstName());
    airman.setLastName(airmanJSON.getLastName());
    airman.setShift(airmanJSON.getShift());
    airman.setQualifications(airmanJSON.getQualifications());
    airman.setCertifications(airmanJSON.getCertifications());
    airman.setEvents(airmanJSON.getEvents());

    return airman;
  }
}
