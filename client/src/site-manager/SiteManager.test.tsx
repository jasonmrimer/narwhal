import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SiteManager } from './SiteManager';
import { Link } from 'react-router-dom';
import { SiteManagerStore } from './stores/SiteManagerStore';
import { FlightModel } from '../flight/model/FlightModel';
import { SquadronModel } from '../squadron/models/SquadronModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { ProfileModel } from '../profile/models/ProfileModel';
import { StyledFlightTables } from './FlightTables';

describe('SiteManager', () => {
  const airman = AirmanModelFactory.build(1, 1);
  const flight1 = new FlightModel(1, 'Flight 1');
  const flight2 = new FlightModel(2, 'Flight 2');
  const squadron = new SquadronModel(1, 'squad1', [ flight1, flight2 ]);
  let siteManagerStore: SiteManagerStore;
  let subject: ShallowWrapper;

  beforeEach(() => {
    siteManagerStore = new SiteManagerStore();
    siteManagerStore.hydrate(({siteName: 'SITE 14'} as ProfileModel), squadron, [ airman ]);
    subject = shallow(<SiteManager siteManagerStore={siteManagerStore}/>);
  });

  it('should render user\'s site name in the header', () => {
    expect(subject.find('h2').text()).toBe(`SITE 14 Personnel`);
  });

  it('should render an New Operator link', () => {
    expect(subject.find('.header').find(Link).prop('to')).toBe('/flights/new');
  });

  it('should render a table for every flight', () => {
    expect(subject.find(StyledFlightTables).exists()).toBeTruthy();
  });
});
