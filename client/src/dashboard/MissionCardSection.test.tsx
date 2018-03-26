import * as React from 'react';
import { MissionCardSection } from './MissionCardSection';
import * as moment from 'moment';
import { MissionModelFactory } from '../mission/factories/MissionModelFactory';
import { ShallowWrapper } from 'enzyme';
import { StyledMission } from '../mission/Mission';

describe('MissionCardSection', () => {
  let subject: ShallowWrapper;
  const missions = [MissionModelFactory.build()];

  beforeEach(() => {
    subject = new ShallowWrapper(
      <MissionCardSection
        missions={missions}
        header="Header Text"
        intervalStart={moment().add(2, 'hours')}
        intervalEnd={moment().add(3, 'hours')}
      />
    );
  });

  it('should render appropriate header text', () => {
    expect(subject.find('.title').text()).toBe('Header Text');
  });

  it('should filter the mission out based on interval', () => {
    expect(subject.find(StyledMission).length).toBe(0);
  });

  it('should show mission count in that section', () => {
    expect(subject.find('.count').text()).toBe('0');
  });
});