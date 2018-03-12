import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { ShiftDropdown } from './ShiftDropdown';
import { AirmanModel, ShiftType } from './airman/models/AirmanModel';
import { ShiftDisplay } from './roster/ShiftDisplay';
import { TrackerStore } from './tracker/stores/TrackerStore';
import { makeFakeTrackerStore } from './utils/testUtils';

describe('ShiftDropdown', () => {
  let subject: ReactWrapper;
  let trackerStore: TrackerStore;
  let updateAirmanShiftSpy = jest.fn();
  let airman: AirmanModel;

  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    updateAirmanShiftSpy = jest.fn();
    trackerStore.updateAirmanShift = updateAirmanShiftSpy;
    airman = trackerStore.airmen[0];
    subject = mount(
      <table>
        <tbody>
        <tr>
          <ShiftDropdown
            airman={airman}
            trackerStore={trackerStore}
          />
        </tr>
        </tbody>
      </table>
    );
  });

  it('should have all ShiftType options on click', () => {
    expect(subject.find('li').length).toBe(0);
    subject.find('div').at(0).simulate('click');
    expect(subject.find('li').length).toBe(3);
  });

  it('should hide the options on click outside', () => {
    subject.find(ShiftDropdown).find('div').at(0).simulate('click');
    expect(subject.find('li').length).toBe(3);

    subject.find(ShiftDropdown).find('div').at(0).simulate('click');

    expect(subject.find('li').length).toBe(0);
  });

  it('should render the shift passed in via props', () => {
    expect(subject.find(ShiftDisplay).prop('shift')).toBe(airman.shift);
  });

  it('should save an airman with a new shift', () => {
    airman.shift = ShiftType.Day;
    subject.find(ShiftDropdown).find('div').at(0).simulate('click');
    subject.find('li').at(0).simulate('click');
    expect(updateAirmanShiftSpy).toHaveBeenCalledTimes(0);
  });

  it('should close the dropdown after a selection is made', () => {
    subject.find(ShiftDropdown).find('div').at(0).simulate('click');
    expect(subject.find('li').length).toBe(3);
    subject.find('li').at(2).simulate('click');
    expect(subject.find('li').length).toBe(0);
  });

  it('should not call the save function if the same shift is selected', () => {
    airman.shift = ShiftType.Day;
    subject.find(ShiftDropdown).find('div').at(0).simulate('click');
    subject.find('li').at(0).simulate('click');
    expect(updateAirmanShiftSpy).toHaveBeenCalledTimes(0);
  });
});