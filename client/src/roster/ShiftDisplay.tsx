import * as React from 'react';
import { ShiftType } from '../airman/models/AirmanModel';
import { DayShiftIcon } from '../icons/DayShiftIcon';
import { SwingShiftIcon } from '../icons/SwingShiftIcon';
import { NightShiftIcon } from '../icons/NightShiftIcon';

interface Props {
  shift?: ShiftType;
}

export const ShiftDisplay = (props: Props) => {
  return (
    <td>
      {props.shift === ShiftType.Day && <DayShiftIcon/>}
      {props.shift === ShiftType.Swing && <SwingShiftIcon/>}
      {props.shift === ShiftType.Night && <NightShiftIcon/>}
      {!props && <div/>}
    </td>
  );
};
