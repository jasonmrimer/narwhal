import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SiteManager } from './SiteManager';
import { SiteManagerStore } from './stores/SiteManagerStore';
import { FlightModel } from '../flight/model/FlightModel';
import { SquadronModel } from '../squadron/models/SquadronModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { ProfileModel } from '../profile/models/ProfileModel';
import { CertificationModelFactory } from '../skills/certification/factories/CertificationModelFactory';
import { StyledCertificationList } from './CertificationList';
import { StyledFlightTables } from './FlightTables';
import { StyledButton } from '../widgets/buttons/Button';
import { StyledAddFlightPopup } from '../widgets/popups/AddFlightPopup';
import { DoubleRepositories } from '../utils/Repositories';
import { SiteManagerActions } from './actions/SiteManagerActions';

describe('SiteManager', () => {
  const airman = AirmanModelFactory.build(1, 1);
  const flight1 = new FlightModel(1, 'Flight 1', 1);
  const flight2 = new FlightModel(2, 'Flight 2', 1);
  const squadron = new SquadronModel(1, 'squad1', [flight1, flight2]);
  let siteManagerStore: SiteManagerStore;
  let siteManagerActions: SiteManagerActions;
  let subject: ShallowWrapper;

  beforeEach(() => {
    siteManagerStore = new SiteManagerStore(DoubleRepositories);
    siteManagerStore.hydrate(
      ({siteName: 'SITE 14'} as ProfileModel),
      squadron,
      [airman],
      CertificationModelFactory.buildList(3, 1),
      []
    );

    siteManagerActions = new SiteManagerActions({siteManagerStore}, DoubleRepositories);

    subject = shallow(
      <SiteManager
        siteManagerActions={siteManagerActions}
        siteManagerStore={siteManagerStore}
      />
    );
  });

  it('should render user\'s site name in the header', () => {
    expect(subject.find('h2').at(0).text()).toBe(`SITE 14 Personnel`);
  });

  it('should render a table for every flight', () => {
    expect(subject.find(StyledFlightTables).exists()).toBeTruthy();
  });

  it('should render a title and information about certifications', () => {
    expect(subject.find('.certification-section-header').text()).toContain('SITE 14 has 3 certifications.');
  });

  it('should render a Add Flight button', () => {
    expect(subject.find(StyledButton).prop('text')).toBe('Add Flight');
  });

  it('should set a pending new flight on Add Flight click', () => {
    subject.find(StyledButton).simulate('click');
    expect(siteManagerStore.pendingNewFlight).toBeDefined();
  });

  it('should render a popup when there is a pending new flight', () => {
    expect(subject.find(StyledAddFlightPopup).exists()).toBeFalsy();
    siteManagerStore.addPendingNewFlight();
    subject.update();
    expect(subject.find(StyledAddFlightPopup).exists()).toBeTruthy();
  });

  it('should remove the popup when there is no pending new flight', () => {
    siteManagerStore.addPendingNewFlight();
    subject.update();
    expect(subject.find(StyledAddFlightPopup).exists()).toBeTruthy();

    siteManagerStore.cancelPendingNewFlight();
    subject.update();
    expect(subject.find(StyledAddFlightPopup).exists()).toBeFalsy();
  });

  it('should render certification table', () => {
    expect(subject.find(StyledCertificationList).exists()).toBeTruthy();
  });
});
