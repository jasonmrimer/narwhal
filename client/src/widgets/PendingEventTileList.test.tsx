import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { StyledPendingEventTile } from './PendingEventTile';
import { PendingEventTileList } from './PendingEventTileList';


describe('PendingEventTileList', () => {
  let subject: ShallowWrapper;

  beforeEach(() => {
    subject = shallow(
      <PendingEventTileList/>
    );
  });

  it('should render pending event tiles', () => {
    expect(subject.find(StyledPendingEventTile).length).toBe(2);
  });
});