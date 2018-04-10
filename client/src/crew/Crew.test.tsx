import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { CrewStore } from './stores/CrewStore';
import { DoubleRepositories } from '../utils/Repositories';
import { Crew } from './Crew';
import { CrewRepositorySpy } from './repositories/doubles/CrewRepositorySpy';
import { StyledCrewPositionRow } from './CrewPositionRow';
import { StyledCrewPositionInputRow } from './CrewPositionInputRow';
import { eventStub } from '../utils/testUtils';

describe('Crew', () => {
  let crewStore: CrewStore;
  let crewStoreSpy = jest.fn();
  let subject: ShallowWrapper;
  let instance: Crew;
  const crew = CrewModelFactory.build();
  const crewPositions = crew.crewPositions;

  beforeEach(async () => {
    DoubleRepositories.crewRepository = new CrewRepositorySpy();

    crewStore = new CrewStore(DoubleRepositories, {refreshAllEvents: jest.fn()});
    await crewStore.hydrate(crew, []);
    crewStore.save = crewStoreSpy;

    subject = shallow(
      <Crew
        crewStore={crewStore}
      />
    );
    instance = (subject.instance() as Crew);
  });

  it('displays Airmen on the mission', () => {
    expect(subject.find(StyledCrewPositionRow).length).toBe(crewPositions.length);
  });

  it('sets the crew position title for each crew member', () => {
    instance.onChange({target: {value: 'chimichanga', name: 'title'}}, 1);
    const position = crewStore.crew!.crewPositions.find(pos => pos.id === 1)!;
    expect(position.title).toBe('chimichanga');
  });

  it('sets the crew position as critical', () => {
    instance.onCheck({target: {checked: true, id: 1, name: 'critical'}}, 1);
    const position = crewStore.crew!.crewPositions.find(pos => pos.id === 1)!;
    expect(position.critical).toBeTruthy();
  });

  it('clears a crew position row', () => {
    instance.handleDeleteChange(eventStub, 1);
    subject.update();
    expect(subject.find(StyledCrewPositionRow).length).toBe(1);
  });

  it('should renders a CrewPositionInputRow', () => {
    expect(subject.find(StyledCrewPositionInputRow).exists()).toBeTruthy();
    expect(subject.find(StyledCrewPositionInputRow).prop('handleNewEntryCheck')).toBe(instance.handleNewEntryCheck);
    expect(subject.find(StyledCrewPositionInputRow).prop('handleNewEntryChange')).toBe(instance.handleNewEntryChange);
    expect(subject.find(StyledCrewPositionInputRow).prop('handleTypeahead')).toBe(instance.handleTypeahead);
  });

  it('sets a new crew member', () => {
    instance.handleNewEntryCheck({target: {value: 'checked', name: 'critical'}});
    instance.handleNewEntryChange({target: {value: 'QB', name: 'title'}});
    instance.handleTypeahead({value: 1, label: 'Munoz, Diana'});
    expect(crewStore.newEntry.airmanName).toBe('Munoz, Diana');
  });
});