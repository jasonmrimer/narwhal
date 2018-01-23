import { Moment } from 'moment';

export default class EventModel {
    constructor(public title: string,
                public description: string,
                public startTime: Moment,
                public endTime: Moment,
                public airmanId: number,
                public id: number | null = null) {
    }
}