import * as React from 'react';
import { ShiftType } from '../airman/models/AirmanModel';
import styled from 'styled-components';
import { ShiftDisplay } from '../roster/ShiftDisplay';
import { inject, observer } from 'mobx-react';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { Can } from '@casl/react';
import { StyledSingleTypeahead } from '../widgets/inputs/SingleTypeahead';

interface Props {
  setShift: (shift: ShiftType) => Promise<void>;
  selectedShift?: ShiftType | null;
  profileStore?: ProfileSitePickerStore;
  className?: string;
  onMenuHide?: (e: Event) => any;
}

export const shiftOptions = [
  {value: ShiftType.Day, label: ShiftType.Day},
  {value: ShiftType.Night, label: ShiftType.Night},
  {value: ShiftType.Swing, label: ShiftType.Swing}
];

export const unsetShiftOptions = [{value: -1, label: 'None'}, ...shiftOptions];

export const ShiftDropdown = observer((props: Props) => {
  const {selectedShift, className, profileStore, setShift} = props;
  return (
    <span
      onClick={(e: any) => e.stopPropagation()}
      className={className}
    >
        <ShiftDisplay shift={selectedShift || undefined}/>
        <Can do="manage" on="all" ability={profileStore!.profile!.ability!}>
          <StyledSingleTypeahead
            options={profileStore!.shiftOptions}
            onChange={async e => {
              if (e !== null) {
                await setShift(e!.value as ShiftType);
              }
            }
            }
            clearButton={false}
            selected={profileStore!.selectedShiftOption(selectedShift)}
            filterBy={() => true}
            className="shift"
            onMenuHide={props.onMenuHide}
          />
        </Can>
    </span>
  );
});

export const StyledShiftDropdown = inject(
  'profileStore'
)(styled(ShiftDropdown)`
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