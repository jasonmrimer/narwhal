import { Moment } from 'moment';
import { SiteModel } from '../../site/models/SiteModel';

export class MissionModel {
  constructor(public id: number,
              public missionId: string,
              public atoMissionNumber: string,
              public startDateTime: Moment,
              public endDateTime: Moment | null = null,
              public platform: string,
              public updatedAt: Moment | null = null,
              public hasCrew: boolean = false,
              public site?: SiteModel,
  ) {
  }

  get displayDateZulu() {
    return `${this.startDateTime.clone().utc().format('DD MMM YY').toUpperCase()}`;
  }

  get displayDateLocal() {
    return `${this.startDateTime.format('DD MMM YY').toUpperCase()}`;
  }

  get displayStartTime() {
    return `${this.startDateTime.clone().utc().format('HHmm')}Z (${this.startDateTime.format('HHmm')}L)`;
  }

  get displayEndTime() {
    return this.endDateTime != null ?
      `${this.endDateTime.clone().utc().format('HHmm')}Z (${this.endDateTime.format('HHmm')}L)` :
      'TBD';
  }

  get displayStartAndEndTime() {
    const startZulu = `${this.startDateTime.clone().utc().format('HHmm')}Z`;
    const endZulu = this.endDateTime ? `${this.endDateTime.clone().utc().format('HHmm')}Z` : 'TBD';
    const startLocal = `${this.startDateTime.format('HHmm')}L`;
    const endLocal = this.endDateTime ? `${this.endDateTime.format('HHmm')}L` : 'TBD';

    return `${startZulu} - ${endZulu} (${startLocal} - ${endLocal})`;
  }

  get displayUpdatedAt() {
    if (this.updatedAt) {
      return `${this.updatedAt.clone().utc().format('YYYY-MM-DD HHmm')}Z`;
    }
    return;
  }
}