import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ShiftDropdown } from './ShiftDropdown';
import { AirmanModel, ShiftType } from './airman/models/AirmanModel';
import { TrackerStore } from './tracker/stores/TrackerStore';
import { makeFakeTrackerStore } from './utils/testUtils';
import { StyledDropdown } from './widgets/Dropdown';

describe('ShiftDropdown', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  let updateAirmanShiftSpy = jest.fn();
  let airman: AirmanModel;

  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    updateAirmanShiftSpy = jest.fn();
    trackerStore.updateAirmanShift = updateAirmanShiftSpy;
    airman = trackerStore.airmen[0];
    subject = shallow(
      <ShiftDropdown
        airman={airman}
        trackerStore={trackerStore}
      />
    );
  });

  it('should save an airman with a new shift', () => {
    airman.shift = ShiftType.Day;
    subject.find(StyledDropdown).simulate('change', {target: {value: ShiftType.Swing}});
    expect(updateAirmanShiftSpy).toHaveBeenCalledWith(airman, ShiftType.Swing);
  });

  it('should not call the save function if the same shift is selected', () => {
    airman.shift = ShiftType.Day;
    subject.find(StyledDropdown).simulate('change', {target: {value: ShiftType.Day}});
    expect(updateAirmanShiftSpy).not.toHaveBeenCalled();
  });
});