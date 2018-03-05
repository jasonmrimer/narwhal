import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { TrackerStore } from './stores/TrackerStore';
import { AirmanDatum } from './AirmanDatum';
import { TabType } from './stores/SidePanelStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { makeFakeTrackerStore } from '../utils/testUtils';

describe('AirmanDatum', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  const airman = AirmanModelFactory.build();

  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    subject = shallow(
      <AirmanDatum
        trackerStore={trackerStore}
        airman={airman}
        text="whatever"
        tab={TabType.CURRENCY}
        className="class"
      />
    );
  });

  it('calls the selectAirman when clicking on an airman', () => {
    subject.simulate('click');
    expect(trackerStore.selectedAirman).toEqual(airman);
    expect(trackerStore.sidePanelStore.selectedTab).toEqual(TabType.CURRENCY);
  });

  it('should render its given text' , () => {
    expect(subject.text()).toBe('whatever');
  });

  it('should set the given className', () => {
    expect(subject.prop('className')).toBe('class');
  });
});