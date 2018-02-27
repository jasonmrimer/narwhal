import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Crew } from './Crew';
import { CrewStore } from './stores/CrewStore';
import { CrewRepositorySpy } from './repositories/doubles/CrewRepositorySpy';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledButton } from '../widgets/Button';

describe('Crew', () => {
  let repositorySpy: CrewRepositorySpy;
  let crewStore: CrewStore;
  let subject: ShallowWrapper;

  const crewModel = CrewModelFactory.build();
  const mission = crewModel.mission;
  const crewPositions = crewModel.crewPositions;

  beforeEach(async () => {
    repositorySpy = new CrewRepositorySpy(crewModel);
    crewStore = new CrewStore(repositorySpy);
    await crewStore.setCrewId(1);

    subject = shallow(
      <Crew
        crewId={crewModel.id}
        crewStore={crewStore}
      />
    );
  });

  it('displays the mission details', () => {
    subject.update();
    expect(subject.text()).toContain(mission.atoMissionNumber);
    expect(subject.text()).toContain(`MSN DATE ${mission.displayDate}`);
    expect(subject.text()).toContain(`MSN START ${mission.displayStartTime}`);
    expect(subject.text()).toContain(`MSN END ${mission.displayEndTime}`);
  });

  it('displays Airmen on the mission', () => {
    subject.update();
    crewPositions.forEach(crewPosition => expect(subject.text()).toContain(crewPosition.airman.lastName));
  });

  it('renders an input for each crew member', () => {
    expect(subject.find(StyledTextInput).length).toBe(crewPositions.length);
    expect(subject.find(StyledTextInput).at(0).prop('name')).toBe('position');
  });

  it('sets the crew position title for each crew member', () => {
    subject.find(StyledTextInput).at(0).simulate('change', {target: {value: 'chimichanga', id: 1}});
    const position = crewStore.crew!.crewPositions.find(pos => pos.id === 1)!;
    expect(position.title).toBe('chimichanga');
  });

  it('was submitCrews submitted', () => {
    subject.find(StyledButton).simulate('click');
    const [crew] = repositorySpy.saveCalls.slice(-1);
    expect(crew).toEqual(crewStore.crew);
  });
});
