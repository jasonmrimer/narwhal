import * as React from 'react';
import { shallow } from 'enzyme';
import { RipItems } from './RipItems';

describe('RipItems', () => {
  let subject = shallow(
    <RipItems
      items={[]}
    />
  );
  it('should print out a list of RIP items', () => {
    expect(subject.find('.item').length).toBe(0);
  });
});