import { Moment } from 'moment';

export default class CertificationModel {
  constructor(public id: number,
              public title: string,
              public expirationDate: Moment) {
  }
}
