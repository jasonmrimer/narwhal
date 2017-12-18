import { Serializer } from '../utils/serializer';
import CertificationModel from './models/CertificationModel';

export class CertificationSerializer implements Serializer<CertificationModel> {
  serialize(item: CertificationModel): {} {
    throw new Error('Not implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): CertificationModel {
    return new CertificationModel(item.id, item.title, item.expirationDate);
  }
}