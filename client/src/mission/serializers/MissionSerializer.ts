import { Serializer } from '../../utils/serializer';
import { MissionModel } from '../models/MissionModel';
import * as moment from 'moment';

export class MissionSerializer implements Serializer<MissionModel> {
  serialize(item: MissionModel): {} {
    throw new Error('Not implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): MissionModel {
    return new MissionModel(
      item.missionId,
      item.atoMissionNumber,
      moment(item.startDateTime, moment.ISO_8601).utc(),
      item.endDateTime ? moment(item.endDateTime, moment.ISO_8601).utc() : null,
      item.site
    );
  }
}