import { Serializer } from '../utils/serializer';
import QualificationModel from './models/QualificationModel';

export class QualificationSerializer implements Serializer<QualificationModel> {
  serialize(item: QualificationModel): {} {
    throw new Error('Not implemented');
  }
  /* tslint:disable:no-any*/
  deserialize(item: any): QualificationModel {
    return new QualificationModel(
      item.id,
      item.acronym,
      item.title,
      item.expirationDate
    );
  }
}