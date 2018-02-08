import AirmanModel from '../models/AirmanModel';
import { randomText } from '../../utils/randomizer';
import * as moment from 'moment';
import EventModel, { EventType } from '../../event/models/EventModel';
import AirmanCertificationModel from '../models/AirmanCertificationModel';
import AirmanQualificationModel from '../models/AirmanQualificationModel';

export default class AirmanModelFactory {
  static build(id: number = 1,
               flightId: number = 1,
               qualifications: AirmanQualificationModel[] = [],
               certifications: AirmanCertificationModel[] = []) {
    return new AirmanModel(
      id,
      flightId,
      randomText(5),
      randomText(5),
      qualifications,
      certifications,
      [
        new EventModel(
          'Fake Event',
          '',
          moment('2017-11-27T05:00:00.000Z'),
          moment('2017-11-27T10:00:00.000Z'),
          id,
          EventType.Mission)
      ]
    );
  }
}