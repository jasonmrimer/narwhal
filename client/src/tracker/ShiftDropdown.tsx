import * as React from 'react';
import { AirmanModel, ShiftType } from '../airman/models/AirmanModel';
import { TrackerStore } from './stores/TrackerStore';
import { StyledDropdown } from '../widgets/inputs/Dropdown';
import styled from 'styled-components';
import { ShiftDisplay } from '../roster/ShiftDisplay';
import { inject, observer } from 'mobx-react';

interface Props {
  trackerStore?: TrackerStore;
  airman: AirmanModel;
  className?: string;
}

export const shiftOptions = [
  {value: ShiftType.Day, label: ShiftType.Day},
  {value: ShiftType.Night, label: ShiftType.Night},
  {value: ShiftType.Swing, label: ShiftType.Swing}
];

export const unsetShiftOptions = [{value: -1, label: 'None'}, ...shiftOptions];

export const ShiftDropdown = observer((props: Props) => {
  const {airman, className, trackerStore} = props;
  const {updateAirmanShift} = trackerStore!;
  return (
    <span
      onClick={(e: any) => e.stopPropagation()}
      className={className}
    >
        <ShiftDisplay shift={airman.shift}/>
        <StyledDropdown
          name="shift"
          options={airman.shift ? shiftOptions : unsetShiftOptions}
          value={airman.shift || -1}
          onChange={async (e: any) => {
            const shiftType = e.target.value;
            if (airman.shift !== shiftType) {
              await updateAirmanShift(airman, shiftType);
            }
          }}
        />
    </span>
  );
});

export const StyledShiftDropdown = inject('trackerStore')(styled(ShiftDropdown)`
  display: flex;
  align-items: center;
  
  & > svg {
    margin-right: 0.25rem;
  }
  
  & > div {
    width: 1rem;
    margin-right: 0.25rem;
  }
  
  & > select {
    border-bottom: none;
  }
`);