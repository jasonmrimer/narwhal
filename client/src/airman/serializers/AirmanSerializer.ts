import { AirmanModel } from '../models/AirmanModel';
import { Serializer } from '../../utils/serializer';
import { AirmanQualificationSerializer } from './AirmanQualificationSerializer';
import { EventSerializer } from '../../event/serializers/EventSerializer';
import { AirmanCertificationSerializer } from './AirmanCertificationSerializer';

export class AirmanSerializer implements Serializer<AirmanModel> {
  private qualSerializer = new AirmanQualificationSerializer();
  private certSerializer = new AirmanCertificationSerializer();
  private eventSerializer = new EventSerializer();

  serialize(item: AirmanModel): {} {
    throw new Error('Not implemented');
  }

  deserialize(item: any): AirmanModel {
    return new AirmanModel(
      item.id,
      item.flightId,
      item.squadronId,
      item.siteId,
      item.firstName,
      item.lastName,
      item.qualifications.map((qual: object) => this.qualSerializer.deserialize(qual)),
      item.certifications.map((cert: object) => this.certSerializer.deserialize(cert)),
      item.events.map((event: object) => this.eventSerializer.deserialize(event)),
      item.shift
    );
  }
}
