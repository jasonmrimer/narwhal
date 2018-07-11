import * as moment from 'moment';
import { Serializer } from '../../utils/serializer';
import { CertificationModel } from '../../skills/certification/models/CertificationModel';
import { AirmanCertificationModel } from '../models/AirmanCertificationModel';

export class AirmanCertificationSerializer implements Serializer<AirmanCertificationModel> {

  serialize(item: AirmanCertificationModel): {} {
    return JSON.stringify(item);
  }

  deserialize(item: any): AirmanCertificationModel {
    return new AirmanCertificationModel(
      item.airmanId,
      new CertificationModel(
        item.certification.id,
        item.certification.title,
        item.certification.siteId
      ),
      moment(item.earnDate),
      moment(item.periodicDue),
      moment(item.currencyExpiration),
      moment(item.lastSat),
      item.id
    );
  }
}