import * as React from 'react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { ShiftDropdown } from './ShiftDropdown';
import { AirmanModel, ShiftType } from '../airman/models/AirmanModel';
import { TrackerStore } from './stores/TrackerStore';
import { StyledDropdown } from '../widgets/inputs/Dropdown';
import { DoubleRepositories } from '../utils/Repositories';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { adminAbility, readerAbility } from '../app/abilities';
import Mock = jest.Mock;
import { makeFakeProfile } from '../utils/testUtils';
import { ProfileModel } from '../profile/models/ProfileModel';

describe('ShiftDropdown', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  let profileStore: ProfileSitePickerStore;
  let airman: AirmanModel;
  let updateAirmanShiftSpy: Mock;
  let profile: ProfileModel;

  beforeEach(async () => {
    profile = makeFakeProfile('ADMIN', adminAbility);
    airman = AirmanModelFactory.build();
    airman.shift = ShiftType.Day;
    updateAirmanShiftSpy = jest.fn();

    trackerStore = new TrackerStore(DoubleRepositories);
    profileStore = new ProfileSitePickerStore(DoubleRepositories);

    profileStore.hydrate([], profile);
    trackerStore.updateAirmanShift = updateAirmanShiftSpy;

    subject = shallow(
      <ShiftDropdown
        airman={airman}
        trackerStore={trackerStore}
        profileStore={profileStore}
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

  it('should not render dropdown when viewing page as a reader', () => {
    profile = makeFakeProfile('READER', readerAbility);
    profileStore.hydrate([], profile);

    const mountedSubject = mount(
      <ShiftDropdown
        airman={airman}
        trackerStore={trackerStore}
        profileStore={profileStore}
      />
    );

    expect(mountedSubject.find(StyledDropdown).exists()).toBeFalsy();
  });
});