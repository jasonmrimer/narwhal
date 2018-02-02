import AirmanModel from '../models/AirmanModel';
import AirmanQualificationModelFactory from './AirmanQualificationModelFactory';
import { randomText } from '../../utils/randomizer';
import * as moment from 'moment';
import EventModel, { EventType } from '../../event/EventModel';
import AirmanCertificationModel from '../models/AirmanCertificationModel';

export default class AirmanModelFactory {
  static build(id: number = 1, flightId: number = 1, certifications: AirmanCertificationModel[] = []) {
    return new AirmanModel(
      id,
      flightId,
      randomText(5),
      randomText(5),
      AirmanQualificationModelFactory.buildList(2),
      certifications,
      [new EventModel(
        'Fake Event',
        '',
        moment('2017-11-27T05:00:00.000Z'),
        moment('2017-11-27T10:00:00.000Z'),
        id,
        EventType.Mission)]
    );
  }
}