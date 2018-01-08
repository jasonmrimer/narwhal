import { Moment } from 'moment';

export default class QualificationModel {
  constructor(public id: number,
              public acronym: string,
              public title: string,
              public expirationDate: Moment) {
      }
}
