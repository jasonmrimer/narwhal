import { Serializer } from '../utils/serializer';
import CertificationModel from './models/CertificationModel';
import * as moment from 'moment';

export class CertificationSerializer implements Serializer<CertificationModel> {
  serialize(item: CertificationModel): {} {
    throw new Error('Not implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): CertificationModel {
    return new CertificationModel(item.id, item.title, moment(item.expirationDate));
  }
}