import { AirmanProfileManagerStore } from './AirmanProfileManagerStore';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { SiteModelFactory } from '../../site/factories/SiteModelFactory';
import { AirmanRipItemFactory } from '../../rip-item/factories/AirmanRipItemFactory';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { AirmanCertificationModelFactory } from '../../airman/factories/AirmanCertificationModelFactory';
import { AirmanQualificationModelFactory } from '../../airman/factories/AirmanQualificationModelFactory';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import { AirmanScheduleModel } from '../../airman/models/AirmanScheduleModel';
import * as moment from 'moment';
import { SiteModel, SiteType } from '../../site/models/SiteModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import Mock = jest.Mock;

describe('AirmanProfileManagerStore', () => {
  const schedule3 = new ScheduleModel(3, ScheduleType.FrontHalf);
  const schedule1 = new ScheduleModel(1, ScheduleType.MondayToFriday);
  let repoMock: AirmanRepository;
  let subject: AirmanProfileManagerStore;
  let airman: AirmanModel;

  beforeEach(() => {
    const sites = SiteModelFactory.buildList(3, 3);
    const squadron = new SquadronModel(8888, 'Squadron', []);

    sites.push(new SiteModel(9998, 'NS', [], SiteType.DGSCoreSite, 'No Squad'));
    sites.push(new SiteModel(9999, 'NF', [squadron], SiteType.DGSCoreSite, 'No Squad'));

    airman = AirmanModelFactory.build(
      1,
      0,
      0,
      0,
      AirmanQualificationModelFactory.buildList(2),
      AirmanCertificationModelFactory.buildList(3, 1),
      [new AirmanScheduleModel(1, schedule1, moment(), null)]
    );

    const airmanRipItems = AirmanRipItemFactory.buildList(airman.id, 10);

    repoMock = {
      findOne: jest.fn(),
      findBySiteId: jest.fn(),
      saveSkill: jest.fn(),
      saveAirman: jest.fn(),
      deleteSkill: jest.fn(),
    };

    const schedules = [
      schedule1,
      new ScheduleModel(2, ScheduleType.BackHalf),
      schedule3,
      new ScheduleModel(4, ScheduleType.NoSchedule)
    ];

    subject = new AirmanProfileManagerStore(repoMock);
    subject.hydrate(airman, sites, schedules, airmanRipItems);
  });

  it('should pass site options', () => {
    expect(subject.siteOptions.length).toBe(5);
  });

  it('should pass squadron options', () => {
    expect(subject.squadronOptions.length).toBe(3);
  });

  it('should pass flight options', () => {
    expect(subject.flightOptions.length).toBe(3);
  });

  it('should return schedule options', () => {
    expect(subject.scheduleOptions.length).toBe(4);
  });

  it('should give expired ripItem count', () => {
    expect(subject.expiredItemCount).toBe(4);
  });

  it('should give the assigned ripItem count', () => {
    expect(subject.assignedItemCount).toBe(10);
  });

  it('should update the airmans first or last name when set', () => {
    subject.setState('lastName', 'Bob');
    expect(subject.airman.lastName).toBe('Bob');

    subject.setState('firstName', 'Sponge');
    expect(subject.airman.firstName).toBe('Sponge');
  });

  it('should update the airmans site, squadron, flight, and shift', () => {
    subject.setState('siteId', 2);
    expect(subject.airman.siteId).toBe(2);

    subject.setState('squadronId', 2);
    expect(subject.airman.squadronId).toBe(2);

    subject.setState('flightId', 2);
    expect(subject.airman.flightId).toBe(2);

    subject.setState('shift', ShiftType.Night);
    expect(subject.airman.shift).toBe(ShiftType.Night);
  });

  it('should assign a default squadron and flight when selecting a site', () => {
    subject.setState('siteId', 2);
    expect(subject.airman.squadronId).toBe(20);
    expect(subject.airman.flightId).toBe(200);

  });

  it('should assign a default flight when selecting a squadron', () => {
    subject.setState('siteId', 2);
    subject.setState('squadronId', 21);
    expect(subject.airman.flightId).toBe(210);
  });

  it('should assign a default squadron and flight when selecting a site', () => {
    subject.setState('siteId', 9998);
    expect(subject.airman.squadronId).toBe(-1);
    expect(subject.airman.flightId).toBe(-1);

  });

  it('should assign a default flight when selecting a squadron', () => {
    subject.setState('siteId', 9999);
    subject.setState('squadronId', 8888);
    expect(subject.airman.flightId).toBe(-1);
  });

  it('should call the airman repository on save', async () => {
    await subject.addAirman();
    expect(repoMock.saveAirman).toHaveBeenCalled();
  });

  it('should set the new schedule upon selection', () => {
    subject.setState('scheduleId', 3);
    expect(subject.scheduleId).toBe(3);
  });

  it('should call the airman repository on save with a new schedule', async () => {
    subject.setState('scheduleId', 3);
    await subject.addAirman();
    const newAirman = (repoMock.saveAirman as Mock).mock.calls[0][0] as AirmanModel;
    const newAirmanSchedule = newAirman.schedules.find(as => as.schedule.id === 3)!;
    expect(newAirmanSchedule.endDate).toBeNull();
    expect(newAirmanSchedule.id).toBeNull();
  });
});