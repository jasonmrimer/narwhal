package mil.af.us.narwhal.airman;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.event.Event;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirmanJSON {
  private static final String emptyFieldMessage = "This field is required.";

  private Long id;

  @Min(value = 0L, message = emptyFieldMessage)
  private Long flightId;

  @NotEmpty(message = emptyFieldMessage)
  private String firstName;

  @NotEmpty(message = emptyFieldMessage)
  private String lastName;

  private ShiftType shift;

  private List<AirmanQualification> qualifications = new ArrayList<>();

  private List<AirmanCertification> certifications = new ArrayList<>();

  private List<AirmanSchedule> schedules = new ArrayList<>();

  private List<Event> events = new ArrayList<>();
}
