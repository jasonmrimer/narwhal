import { SiteManagerStore } from './SiteManagerStore';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { FlightModel } from '../../flight/model/FlightModel';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { CertificationModel } from '../../skills/certification/models/CertificationModel';
import { CertificationModelFactory } from '../../skills/certification/factories/CertificationModelFactory';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import { AirmanScheduleModel } from '../../airman/models/AirmanScheduleModel';
import * as moment from 'moment';
import { DoubleRepositories } from '../../utils/Repositories';

describe('SiteManagerStore', () => {
  let airmen: AirmanModel[];
  let flight1: FlightModel;
  let flight2: FlightModel;
  let squadron: SquadronModel;
  let certifications: CertificationModel[];
  let subject: SiteManagerStore;
  let schedules: ScheduleModel[];
  let flightRepoSaveSpy: jest.Mock;
  const schedule = new ScheduleModel(1, ScheduleType.FrontHalf);
  const schedule2 = new ScheduleModel(2, ScheduleType.BackHalf);

  beforeEach(async () => {
    airmen = AirmanModelFactory.buildList(3);
    airmen.forEach((airman, i) => {
      airman.squadronId = 1;
      airman.flightId = 1;
      airman.shift = (i % 2) === 0 ? ShiftType.Night : ShiftType.Day;
      airman.schedules = [new AirmanScheduleModel(airman.id, schedule, moment())];
    });

    schedules = [schedule, schedule2];
    flight1 = new FlightModel(1, 'Flight 1', 1);
    flight2 = new FlightModel(2, 'Flight 2', 1);

    squadron = new SquadronModel(1, 'squad1', [flight1, flight2]);

    certifications = CertificationModelFactory.buildList(3, 1);

    flightRepoSaveSpy = jest.fn();
    DoubleRepositories.flightRepository.save = flightRepoSaveSpy;

    subject = new SiteManagerStore(DoubleRepositories);

    await subject.hydrate(
      ({siteName: 'SITE 14', siteId: 14} as ProfileModel),
      squadron,
      airmen,
      certifications,
      schedules
    );
  });

  it('should provide the current site', () => {
    expect(subject.siteName)
      .toBe('SITE 14');
  });

  it('should give the flights with their airmen', () => {
    expect(subject.squadron.flights.length)
      .toBe(2);
    expect(subject.getAirmenByFlightId(1))
      .toEqual(airmen);
  });

  it('should get the shift for the flight based on the most commonly used shift', () => {
    expect(subject.getShiftByFlightId(1))
      .toBe(ShiftType.Night);
  });

  it('should set the airmen shift by flight', () => {
    subject.setAirmenShiftByFlightId(1, ShiftType.Swing);
    expect(subject.getShiftByFlightId(1))
      .toBe(ShiftType.Swing);
    expect(subject.getAirmenByFlightId(1).map(a => a.shift))
      .toEqual([ShiftType.Swing, ShiftType.Swing, ShiftType.Swing]);
  });

  it('should provide a list of certifications belonging to the current site', () => {
    expect(subject.certifications.length).toBe(3);
    expect(subject.certifications[0].siteId).toBe(1);
  });

  it('should get scheduleOptions', () => {
    expect(subject.scheduleOptions.length).toBe(2);
    expect(subject.scheduleOptions[0].value).toBe(1);
    expect(subject.scheduleOptions[0].label).toBe('Front Half');
  });

  it('should get the schedule for the flight based on the most commonly used schedule', () => {
    expect(subject.getScheduleIdByFlightId(1)).toBe(String(schedule.id));
  });

  it('should return the schedule given the schedule id', () => {
    expect(subject.getScheduleByScheduleId(1)).toBe(schedule);
  });

  it('should set the airmen schedule by flight', () => {
    airmen.forEach(airman => {
      const now = moment();
      airman.schedules[0].endDate = now;
      airman.schedules.push(new AirmanScheduleModel(airman.id, schedule2, now));
    });

    subject.setAirmenScheduleByFlightId(1, airmen);
    expect(subject.getScheduleIdByFlightId(1))
      .toBe('2');
    expect(subject.getAirmenByFlightId(1).map(a => a.currentAirmanSchedule!.schedule))
      .toEqual([schedule2, schedule2, schedule2]);
  });

  it('should set pending variables when calling schedulePrompt', () => {
    expect(subject.shouldShowSchedulePrompt).toBeFalsy();
    subject.setSchedulePrompt(1, 2);
    expect(subject.shouldShowSchedulePrompt).toBeTruthy();
    expect(subject.pendingFlightId).toBe(1);
    expect(subject.pendingScheduleId).toBe(2);
  });

  it('should set pending variables when calling addNewFlights', () => {
    expect(subject.shouldShowAddFlightPrompt).toBeFalsy();
    subject.setAddNewFlightPrompt();
    expect(subject.shouldShowAddFlightPrompt).toBeTruthy();
  });

  it('should set pending start date when setPendingScheduleStartDate is called', () => {
    const currentMomentString = '2018-05-21T13:53:09-04:00';
    const currentMoment = moment(currentMomentString);
    subject.setPendingScheduleStartDate(currentMoment);
    expect(subject.pendingScheduleStartDate).toEqual(currentMoment);
  });

  it('should hide and reset defaults when hideSchedulePrompt is called', () => {
    const currentDate = moment('2015-08-22');
    subject.setSchedulePrompt(1, 1);
    subject.setPendingScheduleStartDate(currentDate);
    subject.hideSchedulePrompt();
    expect(subject.shouldShowSchedulePrompt).toBeFalsy();
    expect(subject.pendingFlightId).toBeFalsy();
    const isAfter = currentDate.isBefore(subject.pendingScheduleStartDate);
    expect(isAfter).toBeTruthy();
    expect(subject.pendingScheduleId).toBeFalsy();
  });

  it('should trigger a pending flight to add when adding flight', () => {
    subject.addPendingNewFlight();
    expect(subject.pendingNewFlight).toBeDefined();
  });

  it('should cancel the pending new flight', () => {
    subject.addPendingNewFlight();
    subject.cancelPendingNewFlight();
    expect(subject.pendingNewFlight).toBeNull();
  });

  it('should save a new flight', async () => {
    const flight = new FlightModel(-1, 'foo', 1);

    subject.addPendingNewFlight();
    subject.setPendingFlightName('foo');
    await subject.savePendingNewFlight();
    expect(subject.pendingNewFlight).toBeFalsy();
    expect(flightRepoSaveSpy).toHaveBeenCalledWith(flight);
  });

  it('should refresh the flights', async () => {
    const squad = Object.assign({}, subject.squadron);
    await subject.refreshFlights();
    expect(subject.squadron).toEqual(squad);
    expect(subject.squadron).not.toBe(squad);
  });
});
