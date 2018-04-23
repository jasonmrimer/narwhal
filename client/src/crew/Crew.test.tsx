import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { Crew, CrewStoreContract } from './Crew';
import { StyledCrewPositionRow } from './CrewPositionRow';
import { StyledCrewPositionInputRow } from './CrewPositionInputRow';
import { eventStub } from '../utils/testUtils';

describe('Crew', () => {
  let crewStore: CrewStoreContract;
  let subject: ShallowWrapper;
  let instance: Crew;
  const crew = CrewModelFactory.build();
  const crewPositions = crew.crewPositions;

  beforeEach(async () => {
    crewStore = {
      setCrewEntry: jest.fn(),
      clearPosition: jest.fn(),
      setNewEntry: jest.fn(),
      crew: CrewModelFactory.build(1)
    };

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

  it('should render a CrewPositionInputRow', () => {
    expect(subject.find(StyledCrewPositionInputRow).exists()).toBeTruthy();
    expect(subject.find(StyledCrewPositionInputRow).prop('handleNewEntryCheck')).toBe(instance.handleNewEntryCheck);
    expect(subject.find(StyledCrewPositionInputRow).prop('handleNewEntryChange')).toBe(instance.handleNewEntryChange);
    expect(subject.find(StyledCrewPositionInputRow).prop('handleTypeahead')).toBe(instance.handleTypeahead);
  });

  it('sets a new crew member', () => {
    instance.handleNewEntryCheck({target: {checked: true, name: 'critical'}});
    expect(crewStore.setNewEntry).toHaveBeenCalledWith({critical: true});
    instance.handleNewEntryChange({target: {value: 'QB', name: 'title'}});
    expect(crewStore.setNewEntry).toHaveBeenCalledWith({title: 'QB'});
    instance.handleTypeahead({value: 1, label: 'Munoz, Diana'});
    expect(crewStore.setNewEntry).toHaveBeenCalledWith({airmanName: 'Munoz, Diana'});
  });
});