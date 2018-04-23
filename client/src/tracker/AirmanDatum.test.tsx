import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { TrackerStore } from './stores/TrackerStore';
import { AirmanDatum } from './AirmanDatum';
import { SidePanelStore, TabType } from './stores/SidePanelStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { eventStub, forIt } from '../utils/testUtils';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { DoubleRepositories } from '../utils/Repositories';

describe('AirmanDatum', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  let availabilityStore: AvailabilityStore;
  let currencyStore: CurrencyStore;
  let sidePanelStore: SidePanelStore;
  const airman = AirmanModelFactory.build();

  beforeEach(async () => {
    trackerStore = new TrackerStore(DoubleRepositories);
    availabilityStore = new AvailabilityStore(DoubleRepositories);
    currencyStore = new CurrencyStore(DoubleRepositories);
    sidePanelStore = new SidePanelStore();
    subject = shallow(
      <AirmanDatum
        trackerStore={trackerStore}
        airman={airman}
        tab={TabType.CURRENCY}
        className="class"
        availabilityStore={availabilityStore}
        currencyStore={currencyStore}
        sidePanelStore={sidePanelStore}
      >
        <span className="expired">Lazer Vision</span>
      </AirmanDatum>
    );
  });

  it('calls the selectAirman when clicking on an airman', async () => {
    subject.simulate('click', eventStub);
    await forIt();
    expect(trackerStore.selectedAirman).toEqual(airman);
    expect(sidePanelStore.selectedTab).toEqual(TabType.CURRENCY);
  });

  it('should render its given text', () => {
    expect(subject.text()).toBe('Lazer Vision');
  });

  it('should set the given className', () => {
    expect(subject.prop('className')).toBe('class');
  });

  it('should render children', () => {
    expect(subject.text()).toContain('Lazer Vision');
    expect(subject.find('span').length).toBe(2);
    expect(subject.find('span').at(1).prop('className')).toContain('expired');
  });
});