import * as React from 'react';
import { Selectable } from './models/Selectable';
import { observer } from 'mobx-react';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledCheckbox } from '../widgets/inputs/Checkbox';
import { ShiftDisplay } from '../roster/ShiftDisplay';
import styled from 'styled-components';

interface Props {
  airman: Selectable<AirmanModel>;
  className?: string;
}

@observer
export class FlightTableRow extends React.Component<Props> {
  render() {
    const {airman, className} = this.props;
    const navigateToAirman = () => location.href = `/flights/${airman.model.id}`;

    return (
      <React.Fragment>
        <div className={className}>
          <span className="airman-checkbox">
            <StyledCheckbox
              name={'checkbox-airman-' + airman.model.id}
              onChange={() => airman.setSelected(!airman.selected)}
              checked={airman.selected}
            />
          </span>
          <span className="airman-name airman-attribute" onClick={navigateToAirman}>
           {`${airman.model.lastName}, ${airman.model.firstName}`}
          </span>
          <span className="airman-attribute airman-shift" onClick={navigateToAirman}>
            <ShiftDisplay shift={airman.model.shift}/>
            <span>{airman.model.shift}</span>
          </span>
          <span className="airman-attribute airman-schedule" onClick={navigateToAirman}>
            {
              airman.model.currentAirmanSchedule &&
              airman.model.currentAirmanSchedule.schedule.type
            }
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export const StyledFlightTableRow = styled(FlightTableRow)`
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;

  .airman-attribute {
    display: flex;
    align-items: center;
    width: 32%;
    
    > span {
      margin-left: 0.75rem;
    }
  }
  
  &:nth-child(odd) {
    background: ${props => props.theme.dark};
    
    &:hover {
      background: ${props => props.theme.darkest};
    }
  }

  &:nth-child(even) {
    background: ${props => props.theme.light};
    
    &:hover {
      background: ${props => props.theme.darkest};
    }
  }
  
  .airman-checkbox {
    width: 4%;
    padding: 1px;
    display: inline;
  }
`;