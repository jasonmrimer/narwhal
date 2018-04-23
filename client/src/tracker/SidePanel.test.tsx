import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SidePanel } from './SidePanel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledCurrency } from '../currency/Currency';
import { TrackerStore } from './stores/TrackerStore';
import { AirmanCertificationModel } from '../airman/models/AirmanCertificationModel';
import { CertificationModelFactory } from '../skills/factories/CertificationModelFactory';
import * as moment from 'moment';
import { TabAlert } from '../icons/TabAlert';
import { StyledTab } from './Tab';
import { SidePanelStore, TabType } from './stores/SidePanelStore';
import { DoubleRepositories } from '../utils/Repositories';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { PlannerStore } from '../roster/stores/PlannerStore';
import { TimeServiceStub } from './services/doubles/TimeServiceStub';

describe('SidePanel', () => {
  let airman: AirmanModel;
  let trackerStore: TrackerStore;
  let subject: ShallowWrapper;
  let sidePanelStore: SidePanelStore;
  let availabilityStore: AvailabilityStore;
  let currencyStore: CurrencyStore;
  let plannerStore: PlannerStore;

  beforeEach(async () => {
    airman = AirmanModelFactory.build();
    const certification = new AirmanCertificationModel(
      airman.id,
      CertificationModelFactory.build(1, 1),
      moment(),
      moment().subtract(3, 'year')
    );
    airman.certifications.push(certification);
    availabilityStore = new AvailabilityStore(DoubleRepositories);
    trackerStore = new TrackerStore(DoubleRepositories);
    trackerStore.setSelectedAirman(airman);
    sidePanelStore = new SidePanelStore();
    currencyStore = new CurrencyStore(DoubleRepositories);
    plannerStore = new PlannerStore(new TimeServiceStub());

    subject = shallow(
      <SidePanel
        trackerStore={trackerStore}
        sidePanelStore={sidePanelStore}
        availabilityStore={availabilityStore}
        currencyStore={currencyStore}
        plannerStore={plannerStore}
      />
    );
  });

  it('shows the airmans name', () => {
    expect(subject.text()).toContain(`${airman.lastName}, ${airman.firstName}`);
  });

  it('shows two tabs', () => {
    expect(subject.find(StyledTab).length).toBe(2);
    expect(subject.find(StyledTab).at(0).prop('title')).toBe('CURRENCY');
    expect(subject.find(StyledTab).at(1).prop('title')).toBe('AVAILABILITY');
  });

  it('should render the selectedTab from the SidePanelStore', () => {
    sidePanelStore.setSelectedTab(TabType.CURRENCY);
    subject.update();
    expect(subject.find(StyledCurrency).exists()).toBeTruthy();
  });

  it('renders the currency for a selected airman', () => {
    subject.find(StyledTab).at(0).simulate('click');
    expect(subject.find(StyledCurrency).exists()).toBeTruthy();
  });

  it('makes the tab active when selected', () => {
    subject.find(StyledTab).at(0).simulate('click');
    expect(subject.find(StyledTab).at(0).prop('isActive')).toBeTruthy();
    expect(subject.find(StyledTab).at(1).prop('isActive')).toBeFalsy();

    subject.find(StyledTab).at(1).simulate('click');
    expect(subject.find(StyledTab).at(0).prop('isActive')).toBeFalsy();
    expect(subject.find(StyledTab).at(1).prop('isActive')).toBeTruthy();
  });

  it('shows a tab alert when the airman has an expired skill', () => {
    expect(subject.find(TabAlert).exists()).toBeTruthy();
  });

  it('calls the callback', () => {
    subject.find('button').simulate('click');
    expect(trackerStore.selectedAirman.id).toBe(-1);
  });
});