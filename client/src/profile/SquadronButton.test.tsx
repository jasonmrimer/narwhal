import * as React from 'react';
import { shallow } from 'enzyme';
import { SquadronButton } from './SquadronButton';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { SquadronModel } from '../squadron/models/SquadronModel';
import { eventStub } from '../utils/testUtils';

describe('SquadronButton', () => {
  it('should set the pending squadron', () => {
    const profileStore = new ProfileSitePickerStore(DoubleRepositories);
    const squadron = new SquadronModel(1, 'squad', []);
    const subject = shallow(<SquadronButton squadron={squadron} profileStore={profileStore}/>);

    expect(subject.find('button').text()).toBe('squad');

    subject.find('button').simulate('click', eventStub);

    expect(profileStore.pendingSquadron).toBe(squadron);
  });
});