import { AirmanProfileManagerStore } from './AirmanProfileManagerStore';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { SiteModelFactory } from '../../site/factories/SiteModelFactory';
import { AirmanRipItemFactory } from '../../rip-items/factories/AirmanRipItemFactory';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { AirmanCertificationModelFactory } from '../../airman/factories/AirmanCertificationModelFactory';
import { AirmanQualificationModelFactory } from '../../airman/factories/AirmanQualificationModelFactory';

describe('AirmanProfileManagerStore', () => {
  let subject = new AirmanProfileManagerStore();
  let airman: AirmanModel;
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

  subject.hydrate(airman, [SiteModelFactory.build(1, 2)], airmanRipItems);
  });

  it('should pass site options', () => {
    expect(subject.siteOptions.length).toBe(1);
  });

  it('should pass squadron options', () => {
    expect(subject.squadronOptions.length).toBe(2);
  });

  it('should pass flight options', () => {
    expect(subject.flightOptions.length).toBe(2);
  });

  it('should give expired ripItem count', () => {
    expect(subject.expiredItemCount).toBe(4);
  });

  it('should give the assigned ripItem count', () => {
    expect(subject.assignedItemCount).toBe(10);
  });
});