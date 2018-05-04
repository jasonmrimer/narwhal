import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { Crew } from './Crew';
import { StyledCrewPositionRow } from './CrewPositionRow';
import { eventStub } from '../utils/testUtils';
import { CrewStore } from './stores/CrewStore';
import { DoubleRepositories } from '../utils/Repositories';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';

describe('Crew', () => {
  let crewStore: CrewStore;
  let subject: ShallowWrapper;
  let instance: Crew;
  const crew = CrewModelFactory.build();
  const crewPositions = crew.crewPositions;

  beforeEach(async () => {
    crewStore = new CrewStore(DoubleRepositories);

    crewStore.hydrate(crew, [AirmanModelFactory.build()]);
    crewStore.setCrewEntry = jest.fn();
    crewStore.clearPosition = jest.fn();

    subject = shallow(
      <Crew crewStore={crewStore}/>
    );
    instance = (subject.instance() as Crew);
  });

  it('displays Airmen on the mission', () => {
    expect(subject.find(StyledCrewPositionRow).length).toBe(crewPositions.length);
  });

  it('sets the crew position title for each crew member', () => {
    instance.onChange({target: {value: 'chimichanga', name: 'title'}}, 1);
    expect(crewStore.setCrewEntry).toHaveBeenCalledWith(1, {title: 'chimichanga'});
  });

  it('sets the crew position as critical', () => {
    instance.onCheck({target: {checked: true, id: 1, name: 'critical'}}, 1);
    expect(crewStore.setCrewEntry).toHaveBeenCalledWith(1, {critical: true});
  });

  it('clears a crew position row', () => {
    instance.handleDeleteChange(eventStub, 1);
    expect(crewStore.clearPosition).toHaveBeenCalledWith(1);
  });
});
