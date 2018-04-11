import { Moment } from 'moment';
import { SiteModel } from '../../site/models/SiteModel';

export class MissionModel {
  constructor(public id: number,
              public missionId: string,
              public atoMissionNumber: string,
              public startDateTime: Moment,
              public endDateTime: Moment | null = null,
              public platform: string,
              public site?: SiteModel, ) {
  }

  get displayDate() {
    return this.startDateTime
      .clone()
      .utc()
      .format('DD MMM YY')
      .toUpperCase();
  }

  get displayStartTime() {
    return (
      `${this.startDateTime.clone().utc().format('HHmm')}Z (${this.startDateTime.clone().local().format('HHmm')}L)`
    );
  }

  get displayEndTime() {
    return this.endDateTime != null ?
      `${this.startDateTime.clone().utc().format('HHmm')}Z (${this.endDateTime.clone().local().format('HHmm')}L)` :
      'TBD';
  }
}