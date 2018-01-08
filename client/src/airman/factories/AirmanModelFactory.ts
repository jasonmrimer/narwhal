import AirmanModel from '../models/AirmanModel';
import CertificationModelFactory from './CertificationModelFactory';
import QualificationModelFactory from './QualificationModelFactory';
import UnitModelFactory from '../../unit/factories/UnitModelFactory';
import { randomText } from '../../utils/randomizer';
import CrewModelFactory from '../../crew/factories/CrewModelFactory';

export default class AirmanModelFactory {
  static build(unitId: number = 1, crewId: number = 1) {
    return new AirmanModel(
      randomText(5),
      randomText(5),
      QualificationModelFactory.buildList(2),
      CertificationModelFactory.buildList(3),
      [CrewModelFactory.build(crewId, unitId)],
      UnitModelFactory.build(unitId)
    );
  }

  static buildList(amount: number, unitId: number = 1, crewId: number = 1) {
    return Array(amount).fill(null).map(() => {
      return this.build(unitId, crewId);
    });
  }
}