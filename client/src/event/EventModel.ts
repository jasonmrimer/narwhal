import { Moment } from 'moment';

export default class EventModel {
  constructor(public id: number,
              public title: string,
              public description: string,
              public startTime: Moment,
              public endTime: Moment
              ) {
  }
}