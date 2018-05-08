import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { AirmanProfileManager } from './AirmanProfileManager';
import { AirmanModel, ShiftType } from '../airman/models/AirmanModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';
import { StyledSkillTile } from '../skills/SkillTile';
import { StyledRipItemsTile } from '../rip-item/RipItemsTile';
import { SiteModelFactory } from '../site/factories/SiteModelFactory';
import { AirmanRipItemFactory } from '../rip-item/factories/AirmanRipItemFactory';
import { AirmanProfileManagerStore } from './stores/AirmanProfileManagerStore';
import { eventStub, historyMock } from '../utils/testUtils';
import { StyledForm } from '../widgets/Form';
import { DoubleRepositories } from '../utils/Repositories';
import { ScheduleModel, ScheduleType } from '../schedule/models/ScheduleModel';
import { StyledFieldValidation } from '../widgets/FieldValidation';

describe('AirmanProfileManager', () => {
  let profileActions: any;
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

    const schedules = [
      new ScheduleModel(1, ScheduleType.MondayToFriday),
      new ScheduleModel(2, ScheduleType.BackHalf),
      new ScheduleModel(3, ScheduleType.FrontHalf),
      new ScheduleModel(4, ScheduleType.NoSchedule),
    ];

    store = new AirmanProfileManagerStore(DoubleRepositories.airmanRepository);
    store.hydrate(airman, SiteModelFactory.buildList(3, 3), schedules, airmanRipItems);

    profileActions = {
      handleFormSubmit: jest.fn()
    };

    subject = shallow(
      <AirmanProfileManager
        airmanProfileManagerStore={store}
        history={historyMock}
        profileActions={profileActions}
      />
    );
  });

  it('should render the header', () => {
    expect(subject.find('.airman-header').text()).toBe(`${airman.lastName}, ${airman.firstName}`);
  });

  it('should render the personal information about an Airman', () => {
    expect(subject.find('#airman-last-name').prop('value')).toBe(airman.lastName);
    expect(subject.find('#airman-first-name').prop('value')).toBe(airman.firstName);
  });

  it('should render the member organization about an Airman', () => {
    expect(subject.find('#airman-site').props().value).toBe(airman.siteId);
    expect(subject.find('#airman-squadron').props().value).toBe(airman.squadronId);
    expect(subject.find('#airman-flight').props().value).toBe(airman.flightId);
    expect(subject.find('#airman-schedule').props().value).toBe(4);
    expect(subject.find('#airman-shift').props().value).toBe(airman.shift);
  });

  it('should render the skills information about an Airman', () => {
    const skillCount = airman.qualifications.length + airman.certifications.length;
    expect(subject.find(StyledSkillTile).length).toBe(skillCount);
    expect(subject.find(StyledRipItemsTile).exists()).toBeTruthy();
  });

  it('should allow for the editing of an Airman profile', () => {
    changeValue(subject, 'lastName', 'Bob');
    changeValue(subject, 'firstName', 'Sponge');
    changeValue(subject, 'siteId', 2);
    changeValue(subject, 'squadronId', 2);
    changeValue(subject, 'flightId', 2);
    changeValue(subject, 'scheduleId', 2);
    changeValue(subject, 'shift', ShiftType.Night);

    subject.instance().forceUpdate();
    subject.update();

    expectPropToBe(subject, 'lastName', 'Bob');
    expectPropToBe(subject, 'firstName', 'Sponge');
    expectPropToBe(subject, 'siteId', 2);
    expectPropToBe(subject, 'squadronId', 2);
    expectPropToBe(subject, 'flightId', 2);
    expectPropToBe(subject, 'scheduleId', 2);
    expectPropToBe(subject, 'shift', ShiftType.Night);
  });

  it('should call store save onSubmit', () => {
    subject.find(StyledForm).simulate('submit', eventStub);
    expect(profileActions.handleFormSubmit).toHaveBeenCalled();
  });

  it('should show field validation for first name and last name', () => {
    expect(subject.find(StyledFieldValidation).at(0).prop('fieldName')).toBe('lastName');
    expect(subject.find(StyledFieldValidation).at(1).prop('fieldName')).toBe('firstName');
    expect(subject.find(StyledFieldValidation).at(2).prop('fieldName')).toBe('siteId');
    expect(subject.find(StyledFieldValidation).at(3).prop('fieldName')).toBe('squadronId');
    expect(subject.find(StyledFieldValidation).at(4).prop('fieldName')).toBe('flightId');
  });
});

function changeValue(wrapper: ShallowWrapper, name: string, value: any, event: string = 'change') {
  wrapper.findWhere(x => x.prop('name') === name).first().simulate(event, {target: {name, value}});
}

function expectPropToBe(wrapper: ShallowWrapper, name: string, value: any, prop: string = 'value') {
  expect(wrapper.findWhere(x => x.prop('name') === name).prop(prop)).toBe(value);
}