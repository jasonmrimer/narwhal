import { Moment } from 'moment';

export class MissionModel {
  constructor(public missionId: string,
              public atoMissionNumber: string,
              public startDateTime: Moment,
              public endDateTime: Moment | null = null) {
  }
}