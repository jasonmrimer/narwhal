import * as React from 'react';
import { Moment } from 'moment';
import { BackIcon } from '../icons/BackIcon';
import { NextIcon } from '../icons/NextIcon';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { PlannerStore } from '../roster/stores/PlannerStore';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { AvailabilityActions } from './AvailabilityActions';
import { StyledEvent } from './Event';

interface Props {
  availabilityStore?: AvailabilityStore;
  plannerStore?: PlannerStore;
  availabilityActions?: AvailabilityActions;
}

@observer
export class EventsList extends React.Component<Props> {
  render() {
    const {plannerStore, availabilityActions} = this.props;
    const startOfWeek = plannerStore!.sidePanelWeek[0].format('DD MMM').toUpperCase();
    const endOfWeek = plannerStore!.sidePanelWeek[6].format('DD MMM').toUpperCase();
    return (
      <div>
        <div className="event-control-row">
          <button
            className="add-event"
            onClick={availabilityActions!.openEventForm}
          >
            + Add Event
          </button>
        </div>

        <div className="nav-row">
          <button
            className="last-week"
            onClick={async () => await availabilityActions!.decrementWeek()}
          >
            <BackIcon width={12} height={12}/>
          </button>

          <h3>
            {startOfWeek} - {endOfWeek}
          </h3>

          <button
            className="next-week"
            onClick={async () => await availabilityActions!.incrementWeek()}
          >
            <NextIcon width={12} height={12}/>
          </button>
        </div>

        <div className="availability">
          {
            plannerStore!.sidePanelWeek.map((day: Moment, index: number) => {
              return <StyledEvent key={index} day={day}/>;
            })
          }
        </div>
      </div>
    );
  }
}

export const StyledEventsList = inject(
  'availabilityStore',
  'plannerStore',
  'availabilityActions'
)(styled(EventsList)``);