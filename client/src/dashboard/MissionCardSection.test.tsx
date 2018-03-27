import * as React from 'react';
import { MissionCardSection } from './MissionCardSection';
import { MissionModelFactory } from '../mission/factories/MissionModelFactory';
import { ShallowWrapper } from 'enzyme';

describe('MissionCardSection', () => {
  let subject: ShallowWrapper;
  const missions = [MissionModelFactory.build()];

  beforeEach(() => {
    subject = new ShallowWrapper(
      <MissionCardSection
        missions={missions}
        header="Header Text"
      />
    );
  });

  it('should render appropriate header text', () => {
    expect(subject.find('.title').text()).toBe('Header Text');
  });

  it('should show mission count in that section', () => {
    expect(subject.find('.count').text()).toBe('1');
  });
});