import { TopBarActions } from './TopBarActions';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { SiteModelFactory } from '../site/factories/SiteModelFactory';
import { makeFakeProfile } from '../utils/testUtils';
import { adminAbility } from '../app/abilities';

describe('TopBarActions', () => {
  let subject: TopBarActions;
  let profileStore: any;
  let pendingEventStore: any;

  beforeEach(() => {
    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    pendingEventStore = {};

    const profile = makeFakeProfile('ADMIN', adminAbility);
    const site = SiteModelFactory.build(14, 3);
    const airmen = [AirmanModelFactory.build()];
    airmen[0].siteId = 14;
    profileStore.hydrate([site], profile);
  });

  it('should load pending requests on click of Pending Requests', async () => {
    const {airmanRepository, eventRepository} = DoubleRepositories;
    const findBySiteIdSpy = jest.fn();
    const findAllPendingEventsBySiteIdSpy = jest.fn();
    const pendingEventStoreHydrateSpy = jest.fn();
    const setShowListSpy = jest.fn();

    airmanRepository!.findBySiteId = findBySiteIdSpy;
    eventRepository.findAllPendingEventsBySiteId = findAllPendingEventsBySiteIdSpy;
    pendingEventStore.hydrate = pendingEventStoreHydrateSpy;
    pendingEventStore.setShowList = setShowListSpy;

    subject = new TopBarActions(
      {profileStore, pendingEventStore},
      DoubleRepositories
    );

    await subject.getPendingRequests();

    expect(findBySiteIdSpy).toBeCalledWith(14);
    expect(findAllPendingEventsBySiteIdSpy).toBeCalledWith(14);
    expect(pendingEventStoreHydrateSpy).toBeCalled();
    expect(setShowListSpy).toBeCalled();
  });
});