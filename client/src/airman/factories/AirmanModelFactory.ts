import AirmanModel from '../models/AirmanModel';
import QualificationModelFactory from './QualificationModelFactory';
import {randomText} from '../../utils/randomizer';
import * as moment from 'moment';
import EventModel from '../../event/EventModel';
import CertificationModel from '../models/CertificationModel';

export default class AirmanModelFactory {
  static build(id: number = 1, flightId: number = 1, certifications: CertificationModel[] = []) {
    return new AirmanModel(
      id,
      flightId,
      randomText(5),
      randomText(5),
      QualificationModelFactory.buildList(2),
      certifications,
      [new EventModel(1, '', '', moment(), moment())]
    );
  }
}