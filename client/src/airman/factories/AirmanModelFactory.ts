import AirmanModel from '../models/AirmanModel';
import CertificationModelFactory from './CertificationModelFactory';
import QualificationModelFactory from './QualificationModelFactory';
import { randomText } from '../../utils/randomizer';

export default class AirmanModelFactory {
  static build(flightId: number = 1) {
    return new AirmanModel(
      randomText(5),
      randomText(5),
      QualificationModelFactory.buildList(2),
      CertificationModelFactory.buildList(3),
      flightId
    );
  }

  static buildList(amount: number, flightId: number = 1) {
    return Array(amount).fill(null).map(() => {
      return this.build(flightId);
    });
  }
}