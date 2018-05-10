import * as React from 'react';
import { AirmanModel, ShiftType } from '../airman/models/AirmanModel';
import { TrackerStore } from './stores/TrackerStore';
import { StyledDropdown } from '../widgets/inputs/Dropdown';
import styled from 'styled-components';
import { ShiftDisplay } from '../roster/ShiftDisplay';
import { inject, observer } from 'mobx-react';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { Can } from '@casl/react';

interface Props {
  airman: AirmanModel;
  trackerStore?: TrackerStore;
  profileStore?: ProfileSitePickerStore;
  className?: string;
}

export const shiftOptions = [
  {value: ShiftType.Day, label: ShiftType.Day},
  {value: ShiftType.Night, label: ShiftType.Night},
  {value: ShiftType.Swing, label: ShiftType.Swing}
];

export const unsetShiftOptions = [{value: -1, label: 'None'}, ...shiftOptions];

export const ShiftDropdown = observer((props: Props) => {
  const {airman, className, trackerStore, profileStore} = props;
  const {updateAirmanShift} = trackerStore!;

  return (
    <span
      onClick={(e: any) => e.stopPropagation()}
      className={className}
    >
        <ShiftDisplay shift={airman.shift}/>
        <Can do="manage" on="all" ability={profileStore!.profile!.ability!}>
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
        </Can>
    </span>
  );
});

export const StyledShiftDropdown = inject('trackerStore', 'profileStore')(styled(ShiftDropdown)`
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