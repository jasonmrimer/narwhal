import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { AirmanProfileManager } from './AirmanProfileManager';
import { AirmanModel } from '../airman/models/AirmanModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';
import { StyledSkillTile } from '../skills/SkillTile';
import { StyledRipItemsTile } from '../rip-items/RipItemsTile';
import { SiteModelFactory } from '../site/factories/SiteModelFactory';
import { AirmanRipItemFactory } from '../rip-items/factories/AirmanRipItemFactory';
import { AirmanProfileManagerStore } from './stores/AirmanProfileManagerStore';
import { eventStub } from '../utils/testUtils';
import { StyledForm } from '../widgets/Form';
import { DoubleRepositories } from '../utils/Repositories';

describe('AirmanProfileManager', () => {
  let airman: AirmanModel;
  let store: AirmanProfileManagerStore;
  let subject: ShallowWrapper;

  beforeEach(() => {
    airman = AirmanModelFactory.build(
      1,
      1,
      1,
      1,
      AirmanQualificationModelFactory.buildList(2),
      AirmanCertificationModelFactory.buildList(3, 1)
    );

    const airmanRipItems = AirmanRipItemFactory.buildList(airman.id, 10);

    store = new AirmanProfileManagerStore(DoubleRepositories.airmanRepository);
    store.save = jest.fn();
    store.hydrate(airman, [SiteModelFactory.build(1, 2)], airmanRipItems);

    subject = shallow(
      <AirmanProfileManager store={store}/>
    );
  });

  it('should render the header', () => {
    expect(subject.find('.airman-header').text()).toBe(`${airman.lastName}, ${airman.firstName}`);
  });

  it('should render the personal information about an Airman', () => {
    expect(subject.find('#airman-last-name').prop('value')).toBe(airman.lastName);
    expect(subject.find('#airman-first-name').prop('value')).toBe(airman.firstName);
  });

  it('should render the member orginization about an Airman', () => {
    expect(subject.find('#airman-site').props().value).toBe(airman.siteId);
    expect(subject.find('#airman-site').prop('disabled')).toBeTruthy();
    expect(subject.find('#airman-squadron').props().value).toBe(airman.squadronId);
    expect(subject.find('#airman-squadron').prop('disabled')).toBeTruthy();
    expect(subject.find('#airman-flight').props().value).toBe(airman.flightId);
    expect(subject.find('#airman-flight').prop('disabled')).toBeTruthy();
    expect(subject.find('#airman-shift').props().value).toBe(airman.shift);
    expect(subject.find('#airman-shift').prop('disabled')).toBeTruthy();
  });

  it('should render the skills information about an Airman', () => {
    const skillCount = airman.qualifications.length + airman.certifications.length;
    expect(subject.find(StyledSkillTile).length).toBe(skillCount);
    expect(subject.find(StyledRipItemsTile).exists()).toBeTruthy();
  });

  it('should allow for edit of an Airmans last and first name', () => {
    subject.find('#airman-last-name').simulate('change',
      {target: {name: 'lastName', value: 'Bob'}}
    );
    subject.find('#airman-first-name').simulate('change',
      {target: {name: 'firstName', value: 'Sponge'}}
    );

    subject.instance().forceUpdate();
    subject.update();

    expect(subject.find('#airman-last-name').prop('value')).toBe('Bob');
    expect(subject.find('#airman-first-name').prop('value')).toBe('Sponge');

  });

  it('should call store save onSubmit', () => {
    subject.find(StyledForm).simulate('submit', eventStub);
    expect(store.save).toHaveBeenCalled();
  });
});