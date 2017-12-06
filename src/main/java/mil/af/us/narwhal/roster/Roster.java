package mil.af.us.narwhal.roster;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mil.af.us.narwhal.airman.Airman;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Roster {
    private List<Airman> airmen;
}
