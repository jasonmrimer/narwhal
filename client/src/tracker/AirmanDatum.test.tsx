import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { AirmanDatum } from './AirmanDatum';
import { TabType } from './stores/SidePanelStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { eventStub } from '../utils/testUtils';
import { RosterActions } from '../roster/RosterActions';

describe('AirmanDatum', () => {
  let subject: ShallowWrapper;
  const airman = AirmanModelFactory.build();

  beforeEach(async () => {
    RosterActions.openSidePanel = jest.fn();
    subject = shallow(
      <AirmanDatum
        airman={airman}
        tab={TabType.CURRENCY}
        className="class"
      >
        <span className="expired">Lazer Vision</span>
      </AirmanDatum>
    );
  });

  it('calls the selectAirman when clicking on an airman', async () => {
    subject.simulate('click', eventStub);
    expect(RosterActions.openSidePanel).toHaveBeenCalledWith(airman, TabType.CURRENCY);
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