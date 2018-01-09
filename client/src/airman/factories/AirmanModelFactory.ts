import AirmanModel from '../models/AirmanModel';
import CertificationModelFactory from './CertificationModelFactory';
import QualificationModelFactory from './QualificationModelFactory';
import { randomText } from '../../utils/randomizer';

export default class AirmanModelFactory {
  static build(id: number = 1, flightId: number = 1) {
    return new AirmanModel(
      id,
      randomText(5),
      randomText(5),
      QualificationModelFactory.buildList(2),
      CertificationModelFactory.buildList(3),
      flightId
    );
  }
}