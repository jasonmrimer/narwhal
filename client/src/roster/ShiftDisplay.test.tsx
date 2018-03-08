import * as React from 'react';
import { shallow } from 'enzyme';
import { ShiftDisplay } from './ShiftDisplay';
import { ShiftType } from '../airman/models/AirmanModel';
import { DayShiftIcon } from '../icons/DayShiftIcon';
import { SwingShiftIcon } from '../icons/SwingShiftIcon';
import { NightShiftIcon } from '../icons/NightShiftIcon';

describe('ShiftDisplay', () => {
  it('should render day shift icons for airmen', () => {
    const subject = shallow(<ShiftDisplay shift={ShiftType.Day}/>);
    expect(subject.find(DayShiftIcon).exists()).toBeTruthy();
  });

  it('should render swing shift icons for airmen', () => {
    const subject = shallow(<ShiftDisplay shift={ShiftType.Swing}/>);
    expect(subject.find(SwingShiftIcon).exists()).toBeTruthy();
  });

  it('should render night shift icons for airmen', () => {
    const subject = shallow(<ShiftDisplay shift={ShiftType.Night}/>);
    expect(subject.find(NightShiftIcon).exists()).toBeTruthy();
  });

  it('should render no shift icons for airmen', () => {
    const subject = shallow(<ShiftDisplay />);
    expect(subject.find('div').exists).toBeTruthy();
  });
});