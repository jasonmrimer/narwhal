import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { PendingEventTileList } from './PendingEventTileList';
import { PendingEventStore } from './stores/PendingEventStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { SiteModelFactory } from '../site/factories/SiteModelFactory';
import { EventModelFactory } from '../event/factories/EventModelFactory';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { makeFakeProfile } from '../utils/testUtils';
import { adminAbility } from '../app/abilities';

describe('PendingEventTileList', () => {
  let subject: ShallowWrapper;
  let pendingEventStore: PendingEventStore;
  let profileStore: ProfileSitePickerStore;

  beforeEach(async () => {
    const site = SiteModelFactory.build(14, 1);
    const profile = makeFakeProfile('ADMIN', adminAbility);
    const airmen = [
      AirmanModelFactory.build()
    ];
    airmen[0].siteId = 14;
    airmen[0].flightId = 1400;
    airmen[0].squadronId = 140;
    const events = [
      EventModelFactory.build(),
      EventModelFactory.build()
    ];

    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate([site], profile);

    pendingEventStore = new PendingEventStore();

    pendingEventStore.hydrate(airmen, events,  site);
    subject = shallow(
      <PendingEventTileList pendingEventStore={pendingEventStore} profileStore={profileStore}/>
    );
  });

  it('should render pending event tiles', () => {
    expect(subject.html().split('Fake Event').length).toBe(3);
  });
});