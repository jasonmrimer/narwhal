import * as moment from 'moment';

export default class QualificationModel {
  /* tslint:disable:no-any*/
  constructor(public id: number,
              public acronym: string,
              public title: string,
              public expirationDate: any) {
    this.expirationDate = moment(expirationDate);
  }
}
