import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Planner } from './Planner';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { PlannerStore } from './stores/PlannerStore';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { StyledPlannerEvent } from './PlannerEvent';

describe('Planner', () => {
  let subject: ShallowWrapper;

  beforeEach(async () => {
    subject = shallow(
      <Planner
        airman={AirmanModelFactory.build()}
        plannerStore={new PlannerStore(new TimeServiceStub())}
      />);
  });

  it('renders a planner event for each day of the week', () => {
    expect(subject.find(StyledPlannerEvent).length).toBe(14);
  });
});