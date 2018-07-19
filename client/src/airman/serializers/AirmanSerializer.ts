import { AirmanModel } from '../models/AirmanModel';
import { Serializer } from '../../utils/serializer';
import { AirmanQualificationSerializer } from './AirmanQualificationSerializer';
import { AirmanCertificationSerializer } from './AirmanCertificationSerializer';
import { AirmanScheduleSerializer } from './AirmanScheduleSerializer';
import { RankSerializer } from '../../rank/serialziers/RankSerializer';

export class AirmanSerializer implements Serializer<AirmanModel> {
  private qualificationSerializer = new AirmanQualificationSerializer();
  private certificationSerializer = new AirmanCertificationSerializer();
  private airmanScheduleSerializer = new AirmanScheduleSerializer();
  private rankSerializer = new RankSerializer();

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
      this.rankSerializer.deserialize(item.rank),
      item.qualifications.map((q: object) => this.qualificationSerializer.deserialize(q)),
      item.certifications.map((cert: object) => this.certificationSerializer.deserialize(cert)),
      item.schedules.map((schedule: object) => this.airmanScheduleSerializer.deserialize(schedule)),
      item.shift,
      item.remarks
    );
  }
}
