import * as moment from 'moment';
import { Moment } from 'moment';
import { SiteModel } from '../../site/models/SiteModel';

export class MissionModel {
  static empty(): MissionModel {
    return new MissionModel('', '', moment(), moment());
  }

  constructor(public missionId: string,
              public atoMissionNumber: string,
              public startDateTime: Moment,
              public endDateTime: Moment | null = null,
              public site?: SiteModel) {
  }

  get displayDate() {
    return this.startDateTime
      .local()
      .format('DD MMM YY')
      .toUpperCase();
  }

  get displayStartTime() {
    return `${this.startDateTime.local().format('HHmm')}L`;
  }

  get displayEndTime() {
    return this.endDateTime != null ?
      `${this.endDateTime.local().format('HHmm')}L` :
      'UNKNOWN';
  }
}