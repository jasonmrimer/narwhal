import { AirmanProfileManagerStore } from './AirmanProfileManagerStore';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { SiteModelFactory } from '../../site/factories/SiteModelFactory';
import { AirmanRipItemFactory } from '../../rip-items/factories/AirmanRipItemFactory';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { AirmanCertificationModelFactory } from '../../airman/factories/AirmanCertificationModelFactory';
import { AirmanQualificationModelFactory } from '../../airman/factories/AirmanQualificationModelFactory';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';

describe('AirmanProfileManagerStore', () => {
  let repoMock: AirmanRepository;
  let subject: AirmanProfileManagerStore;
  let airman: AirmanModel;

  beforeEach(() => {
    const sites = SiteModelFactory.buildList(3, 3);

    airman = AirmanModelFactory.build(
      1,
      0,
      0,
      0,
      AirmanQualificationModelFactory.buildList(2),
      AirmanCertificationModelFactory.buildList(3, 1)
    );

    const airmanRipItems = AirmanRipItemFactory.buildList(airman.id, 10);

    repoMock = {
      findOne: jest.fn(),
      findBySiteId: jest.fn(),
      saveSkill: jest.fn(),
      saveAirman: jest.fn(),
      deleteSkill: jest.fn(),
    };

    subject = new AirmanProfileManagerStore(repoMock);
    subject.hydrate(airman, sites, airmanRipItems);
  });

  it('should pass site options', () => {
    expect(subject.siteOptions.length).toBe(3);
  });

  it('should pass squadron options', () => {
    expect(subject.squadronOptions.length).toBe(3);
  });

  it('should pass flight options', () => {
    expect(subject.flightOptions.length).toBe(3);
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

    subject.setState('squadronId', 2)
    expect(subject.airman.squadronId).toBe(2);

    subject.setState('flightId', 2)
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

  it('should call the airman repository on save', async () => {
    await subject.save();
    expect(repoMock.saveAirman).toHaveBeenCalled();
  });
});