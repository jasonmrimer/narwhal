package mil.af.us.narwhal.event;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventApprovalJSON {
    private Long eventId;

    private EventApproval approval;

    private EventApprovalRole approvalRole;

}
