import AirmanModel from '../models/AirmanModel';
import { Serializer } from '../../utils/serializer';
import { QualificationSerializer } from './QualificationSerializer';
import { CertificationSerializer } from './CertificationSerializer';

export class AirmanSerializer implements Serializer<AirmanModel> {
  private qualSerializer = new QualificationSerializer();
  private certSerializer = new CertificationSerializer();

  serialize(item: AirmanModel): {} {
    throw new Error('Not implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): AirmanModel {
    return new AirmanModel(
      item.id,
      item.firstName,
      item.lastName,
      item.qualifications.map((qual: object) => this.qualSerializer.deserialize(qual)),
      item.certifications.map((cert: object) => this.certSerializer.deserialize(cert)),
      item.flightId
    );
  }
}
