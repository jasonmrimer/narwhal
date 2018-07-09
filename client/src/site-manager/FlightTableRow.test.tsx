import { shallow, ShallowWrapper } from 'enzyme';
import { AirmanModel, ShiftType } from '../airman/models/AirmanModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { AirmanScheduleModel } from '../airman/models/AirmanScheduleModel';
import { ScheduleModel, ScheduleType } from '../schedule/models/ScheduleModel';
import * as moment from 'moment';
import { Selectable } from './models/Selectable';
import * as React from 'react';
import { FlightTableRow } from './FlightTableRow';
import { StyledCheckbox } from '../widgets/inputs/Checkbox';

describe('FlightTableRow', () => {
  let subject: ShallowWrapper;
  let airman: Selectable<AirmanModel>;

  beforeEach(() => {
    const airmanSchedule = new AirmanScheduleModel(1, new ScheduleModel(1, ScheduleType.NoSchedule), moment());
    const airmanModel = AirmanModelFactory.build();
    airmanModel.shift = ShiftType.Day;
    airmanModel.schedules.push(airmanSchedule);

    airman = new Selectable<AirmanModel>(airmanModel);
    airman.setSelected = jest.fn();

    subject = shallow(
      <FlightTableRow airman={airman}/>
    );
  });

  it('should render airman attributes', () => {
    expect(subject.find('.airman-name').text()).toContain(`${airman.model.lastName}, ${airman.model.firstName}`);
    expect(subject.find('.airman-shift').text()).toContain(airman.model.shift!.toString());
    expect(subject.find('.airman-schedule').text()).toContain(airman.model.schedules[0].schedule.type.toString());
  });

  it('should set the airman to selected when you click the checkbox', () => {
    subject.find(StyledCheckbox).simulate('change');
    expect(airman.setSelected).toHaveBeenCalled();
  });
});