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
      item.id,
      item.missionId,
      item.atoMissionNumber,
      moment(item.startDateTime),
      item.endDateTime ? moment(item.endDateTime) : null,
      item.site
    );
  }
}