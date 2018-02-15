import { Serializer } from '../../utils/serializer';
import { AirmanQualificationModel } from '../models/AirmanQualificationModel';
import * as moment from 'moment';
import { QualificationModel } from '../../skills/models/QualificationModel';

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
      moment(item.earnDate),
      moment(item.expirationDate),
      item.id
    );
  }
}