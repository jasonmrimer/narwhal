import * as React from 'react';
import { StyledBackButton } from '../widgets/buttons/BackButton';
import { StyledRadioButtons } from '../widgets/inputs/RadioButtons';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { StyledEventForm } from './EventForm';
import { AvailabilityActions } from './AvailabilityActions';

interface Props {
  availabilityStore?: AvailabilityStore;
  availabilityActions?: AvailabilityActions;
}

@observer
export class EventFormContainer extends React.Component<Props> {
  render() {
    const {availabilityStore, availabilityActions} = this.props;
    const {eventFormType, setEventFormType} = availabilityStore!;

    return (
      <div>
        <StyledBackButton
          onClick={availabilityStore!.closeEventForm}
          text="Back to Week View"
        />
        {
          availabilityStore!.shouldShowEventTypeSelection &&
          <div className="form-wrapper">
            <div>Select Event Type:</div>
            <StyledRadioButtons
              name="eventType"
              options={availabilityActions!.radioOptions()}
              value={eventFormType}
              onChange={e => setEventFormType(e.target.value)}
            />
          </div>
        }
        <StyledEventForm/>
      </div>
    );
  }
}

export const StyledEventFormContainer = inject(
  'availabilityStore',
  'availabilityActions'
)(styled(EventFormContainer)``);