package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.event.Event;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirmanJSON {
  private Long id;

  private Long flightId;

  private String firstName;

  private String lastName;

  private ShiftType shift;

  private List<AirmanQualification> qualifications = new ArrayList<>();

  private List<AirmanCertification> certifications = new ArrayList<>();

  private List<AirmanSchedule> schedules = new ArrayList<>();

  private List<Event> events = new ArrayList<>();
}
