import * as moment from 'moment';

export default class CertificationModel {
  /* tslint:disable:no-any*/
  constructor(public id: number,
              public title: string,
              public expirationDate: any) {
    this.expirationDate = moment(expirationDate);
  }
}
