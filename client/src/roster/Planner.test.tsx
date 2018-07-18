import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Planner } from './Planner';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledPlannerEvent } from './PlannerEvent';
import * as moment from 'moment';

describe('Planner', () => {
  let subject: ShallowWrapper;

  beforeEach(async () => {
    subject = shallow(
      <Planner
        airman={AirmanModelFactory.build()}
        plannerWeek={[
          moment(),
          moment(),
          moment(),
        ]}
      />);
  });

  it('renders a planner event for each day of the week', () => {
    expect(subject.find(StyledPlannerEvent).length).toBe(3);
  });
});