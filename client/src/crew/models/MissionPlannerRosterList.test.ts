import { EmptyNotification, MissionPlannerRosterList, SubHeader } from './MissionPlannerRosterList';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';

describe('MissionPlannerRosterList', () => {
  const available = AirmanModelFactory.buildList(1, 10);
  const unavailable = AirmanModelFactory.buildList(1, 20);
  let subject: MissionPlannerRosterList;

  it('should render available and unavailable list items and empty notifications', () => {
    subject = new MissionPlannerRosterList([], []);

    expect(subject.size).toBe(4);
    expect(subject.get(0)).toEqual(SubHeader.Available());
    expect(subject.get(1)).toEqual(EmptyNotification.NoneAvailable());
    expect(subject.get(2)).toEqual(SubHeader.Unavailable());
    expect(subject.get(3)).toEqual(EmptyNotification.NoneAssigned());
  });

  it('should produce a list of available and unavailable airmen', () => {
    subject = new MissionPlannerRosterList(available, unavailable);

    expect(subject.size).toBe(4);
    expect(subject.get(0)).toEqual(SubHeader.Available());
    expect(subject.get(1)).toEqual(available[0]);
    expect(subject.get(2)).toEqual(SubHeader.Unavailable());
    expect(subject.get(3)).toEqual(unavailable[0]);
  });

  it('should apply filters to the list of airmen', () => {
    subject = new MissionPlannerRosterList(available, unavailable, () => []);

    expect(subject.size).toBe(4);
    expect(subject.get(0)).toEqual(SubHeader.Available());
    expect(subject.get(1)).toEqual(EmptyNotification.NoneFound());
    expect(subject.get(2)).toEqual(SubHeader.Unavailable());
    expect(subject.get(3)).toEqual(EmptyNotification.NoneFound());
  });
});