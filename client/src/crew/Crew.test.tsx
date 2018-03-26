import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Crew } from './Crew';
import { CrewStore } from './stores/CrewStore';
import { CrewRepositorySpy } from './repositories/doubles/CrewRepositorySpy';
import { CrewModelFactory } from './factories/CrewModelFactory';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledButton } from '../widgets/Button';
import { FakeAirmanRepository } from '../airman/repositories/doubles/FakeAirmanRepository';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledCheckbox } from '../widgets/Checkbox';
import { Link } from 'react-router-dom';

describe('Crew', () => {
  let repositorySpy: CrewRepositorySpy;
  let crewStore: CrewStore;
  let subject: ShallowWrapper;

  const crewModel = CrewModelFactory.build();
  const mission = crewModel.mission;
  const crewPositions = crewModel.crewPositions;

  beforeEach(async () => {
    repositorySpy = new CrewRepositorySpy(crewModel);
    const airmanRepository = new FakeAirmanRepository();
    airmanRepository.findAll = () => Promise.resolve([new AirmanModel(1, 1, 1, 1, 'Diana', 'Munoz')]);

    crewStore = new CrewStore(repositorySpy, airmanRepository);
    await crewStore.hydrate(crewModel.id);

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
    expect(subject.find(StyledTextInput).length).toBe(crewPositions.length + 2);
  });

  it('renders a link back to Tracker', () => {
    expect(subject.find(Link).exists()).toBeTruthy();
    expect(subject.find(Link).prop('to')).toBe('/');
  });

  it('sets the crew position title for each crew member', () => {
    subject.find(StyledTextInput).at(0).simulate('change', {target: {value: 'chimichanga', id: 1, name: 'title'}});
    const position = crewStore.crew!.crewPositions.find(pos => pos.id === 1)!;
    expect(position.title).toBe('chimichanga');
  });

  it('sets the crew position as critical', () => {
    subject.find(StyledCheckbox).at(0).simulate('change',  {
      target:
        {
          checked: true,
          id: 1,
          name: 'critical'
        }
    });
    const position = crewStore.crew!.crewPositions.find(pos => pos.id === 1)!;
    expect(position.critical).toBeTruthy();
  });

  it('submits crew on submitCrews', () => {
    subject.find(StyledButton).simulate('click');
    const [crew] = repositorySpy.saveCalls.slice(-1);
    expect(crew).toEqual(crewStore.crew);
  });

  it('sets a new crew member', () => {
    subject.find(StyledCheckbox).at(2).simulate('change', {target: {value: 'checked', name: 'critical'}});
    subject.find(StyledTextInput).at(2).simulate('change', {target: {value: 'QB', name: 'title'}});
    subject.find(StyledTextInput).at(3).simulate('change', {target: {value: 'Munoz, Diana', name: 'airmanName'}});
    expect(crewStore.newEntry.airmanName).toBe('Munoz, Diana');
  });
});
