import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ShiftDropdown } from './ShiftDropdown';
import { AirmanModel, ShiftType } from '../airman/models/AirmanModel';
import { TrackerStore } from './stores/TrackerStore';
import { StyledDropdown } from '../widgets/Dropdown';
import { DoubleRepositories } from '../utils/Repositories';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import Mock = jest.Mock;

describe('ShiftDropdown', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  let airman: AirmanModel;
  let updateAirmanShiftSpy: Mock;

  beforeEach(async () => {
    updateAirmanShiftSpy = jest.fn();
    trackerStore = new TrackerStore(DoubleRepositories);
    airman = AirmanModelFactory.build();
    airman.shift = ShiftType.Day;
    trackerStore.updateAirmanShift = updateAirmanShiftSpy;
    subject = shallow(
      <ShiftDropdown
        airman={airman}
        trackerStore={trackerStore}
      />
    );
  });

  it('should save an airman with a new shift', () => {
    subject.find(StyledDropdown).simulate('change', {target: {value: ShiftType.Swing}});
    expect(updateAirmanShiftSpy).toHaveBeenCalledWith(airman, ShiftType.Swing);
  });

  it('should not call the save function if the same shift is selected', () => {
    subject.find(StyledDropdown).simulate('change', {target: {value: ShiftType.Day}});
    expect(updateAirmanShiftSpy).not.toHaveBeenCalled();
  });
});