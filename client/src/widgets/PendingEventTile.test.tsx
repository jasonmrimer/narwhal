import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { PendingEventTile } from './PendingEventTile';
import { EventModelFactory } from '../event/factories/EventModelFactory';
import { SiteModelFactory } from '../site/factories/SiteModelFactory';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { SidePanelActions } from '../tracker/SidePanelActions';
import { TabType } from '../tracker/stores/SidePanelStore';
import { DoubleRepositories } from '../utils/Repositories';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';

describe('PendingEventTitle', () => {
  let subject: ShallowWrapper;
  let sidePanelActions: SidePanelActions;
  let profileStore: any;

  const site = SiteModelFactory.build(1, 5);
  const airman = AirmanModelFactory.build(
    1,
    site.squadrons[0].flights[0].id,
    site.squadrons[0].id,
    site.id
  );
  const event = EventModelFactory.build();

  sidePanelActions = new SidePanelActions({});

  beforeEach(() => {
    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    subject = shallow(
      <PendingEventTile
        site={site}
        airman={airman}
        event={event}
        sidePanelActions={sidePanelActions}
        profileStore={profileStore}
      />);
  });

  it('should render the airman\' Name', () => {
    expect(subject.find('.airman-name').text()).toContain(airman.firstName);
    expect(subject.find('.airman-name').text()).toContain(airman.lastName);
  });

  it('should render the airman org information', () => {
    expect(subject.find('.airman').text()).toContain(site.squadrons[0].name);
    expect(subject.find('.airman').text()).toContain(site.squadrons[0].flights[0].name);
  });

  it('should render the event info', () => {
    expect(subject.find('.event').text()).toContain(event.title);
  });

  it('should open side panel when clicked', () => {
    sidePanelActions.openSidePanel = jest.fn();
    subject.find('.event-tile').at(0).simulate('click');
    expect(sidePanelActions.openSidePanel).toHaveBeenCalledWith(airman, TabType.AVAILABILITY, event.startTime);
  });
});