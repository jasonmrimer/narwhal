import { Serializer } from '../../utils/serializer';
import AirmanQualificationModel from '../models/AirmanQualificationModel';
import * as moment from 'moment';
import QualificationModel from '../../qualifications/models/QualificationModel';

export class AirmanQualificationSerializer implements Serializer<AirmanQualificationModel> {
  serialize(item: AirmanQualificationModel): {} {
    return JSON.stringify(item);
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): AirmanQualificationModel {
    return new AirmanQualificationModel(
      item.airmanId,
      new QualificationModel(
        item.qualification.id,
        item.qualification.acronym,
        item.qualification.title
      ),
      moment.utc(item.earnDate),
      moment.utc(item.expirationDate),
      item.id
    );
  }
}