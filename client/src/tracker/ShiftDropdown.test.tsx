import * as React from 'react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { ShiftDropdown } from './ShiftDropdown';
import { ShiftType } from '../airman/models/AirmanModel';
import { StyledDropdown } from '../widgets/inputs/Dropdown';
import { DoubleRepositories } from '../utils/Repositories';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { adminAbility, readerAbility } from '../app/abilities';
import { makeFakeProfile } from '../utils/testUtils';
import { ProfileModel } from '../profile/models/ProfileModel';
import Mock = jest.Mock;

describe('ShiftDropdown', () => {
  let profileStore: ProfileSitePickerStore;
  let setShift: Mock;
  let profile: ProfileModel;
  let subject: ShallowWrapper;

  beforeEach(async () => {
    profile = makeFakeProfile('ADMIN', adminAbility);

    setShift = jest.fn();

    profileStore = new ProfileSitePickerStore(DoubleRepositories);

    await profileStore.hydrate([], profile);

    subject = shallow(
      <ShiftDropdown
        selectedShift={ShiftType.Day}
        setShift={setShift}
        profileStore={profileStore}
      />
    );
  });

  it('should render the selected shift', () => {
    expect(subject.find(StyledDropdown).prop('value')).toEqual(ShiftType.Day);
  });

  it('should call setShift with a new shift', () => {
    subject.find(StyledDropdown).simulate('change', {target: {value: ShiftType.Swing}});
    expect(setShift).toHaveBeenCalledWith(ShiftType.Swing);
  });

  it('should not render dropdown when viewing page as a reader', async () => {
    profile = makeFakeProfile('READER', readerAbility);
    await profileStore.hydrate([], profile);

    const mountedSubject = mount(
      <ShiftDropdown
        selectedShift={ShiftType.Day}
        setShift={setShift}
        profileStore={profileStore}
      />
    );

    expect(mountedSubject.find(StyledDropdown).exists()).toBeFalsy();
  });
});