import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { StyledEventFormContainer } from './EventFormContainer';
import { StyledEventsList } from './EventsList';

interface Props {
  availabilityStore?: AvailabilityStore;
  className?: string;
}

@observer
export class Availability extends React.Component<Props> {
  render() {
    const {availabilityStore} = this.props;
    return (
      <div className={this.props.className}>
        {availabilityStore!.shouldShowEventForm ? <StyledEventFormContainer /> : <StyledEventsList/>}
      </div>
    );
  }
}

export const StyledAvailability = inject('availabilityStore')(styled(Availability)`
  width: 100%;
  text-align: left;

  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
  }
   
   .form-wrapper {
     color: ${props => props.theme.graySteel};
   }

  .event-control-row {
    display: flex;
    justify-content: flex-end;

    .add-event {
      font-size: 16px;
      margin: 0.5rem 1rem;
      color: ${props => props.theme.fontColor};
      background-color: ${props => props.theme.lighter};
      border: none;
      cursor: pointer;
     
      :hover{
        background: ${props => props.theme.fontColor};
        color: ${props => props.theme.darkest};
      }
     }
  }

  .event-date {
    text-align: left;
    font-size: 0.75rem;
    margin-top: 1.5rem;
    cursor: pointer;
    height: 0.75rem;
    align-items: center;
    display: flex;
  }

  .event-name {
    color: ${props => props.theme.graySteel};
    border-bottom: ${props => props.theme.graySteel} 1px solid;
    margin: 1.5rem 20%;
    text-align: center;
  }
  
  .nav-row {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
   
    button {
      background-color: ${props => props.theme.lighter};
      border: none;
      cursor: pointer;
    }
  }
  
  .add-event-on-date {
      display: inline;
      margin-left: 0.75rem;
      margin-top: 0;
      padding: 0;
      font-size: inherit;
      font-weight: inherit;
      color: ${props => props.theme.fontColor};
      cursor: pointer;
  }
`);
