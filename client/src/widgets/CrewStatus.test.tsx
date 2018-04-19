import * as React from 'react';
import { shallow } from 'enzyme';
import { CrewStatus } from './CrewStatus';

describe('CrewStatus', () => {
  it('should render the crew status', () => {
    let subject = shallow(
      <CrewStatus hasCrew={true}/>
    );
    expect(subject.text()).toContain('DRAFTING');

    subject = shallow(
      <CrewStatus hasCrew={false}/>
    );
    expect(subject.text()).toContain('NO CREW');
  });
});
