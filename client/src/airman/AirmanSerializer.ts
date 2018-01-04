import AirmanModel from './models/AirmanModel';
import { Serializer } from '../utils/serializer';
import { QualificationSerializer } from '../qualification/QualificationSerializer';
import { CertificationSerializer } from '../certification/CertificationSerializer';
import { CrewSerializer } from '../crew/CrewSerializer';

export class AirmanSerializer implements Serializer<AirmanModel> {
  private qualSerializer = new QualificationSerializer();
  private certSerializer = new CertificationSerializer();
  private crewSerializer = new CrewSerializer();

  serialize(item: AirmanModel): {} {
    throw new Error('Not implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): AirmanModel {
    return new AirmanModel(
      item.firstName,
      item.lastName,
      item.qualifications.map((qual: object) => this.qualSerializer.deserialize(qual)),
      item.certifications.map((cert: object) => this.certSerializer.deserialize(cert)),
      item.crew.map((crew: object) => this.crewSerializer.deserialize(crew)),
      item.unit
    );
  }
}
