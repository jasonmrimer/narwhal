import * as moment from 'moment';
import { Serializer } from '../../utils/serializer';
import { CertificationModel } from '../../skills/models/CertificationModel';
import { AirmanCertificationModel } from '../models/AirmanCertificationModel';

export class AirmanCertificationSerializer implements Serializer<AirmanCertificationModel> {
  serialize(item: AirmanCertificationModel): {} {
    return JSON.stringify(item);
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): AirmanCertificationModel {
    return new AirmanCertificationModel(
      item.airmanId,
      new CertificationModel(
        item.certification.id,
        item.certification.title
      ),
      moment.utc(item.earnDate),
      moment.utc(item.expirationDate),
      item.id
    );
  }
}