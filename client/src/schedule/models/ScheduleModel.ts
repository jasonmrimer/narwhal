export class ScheduleModel {
  constructor(public id: number,
              public type: string,
              public sunday: boolean,
              public monday: boolean,
              public tuesday: boolean,
              public wednesday: boolean,
              public thursday: boolean,
              public friday: boolean,
              public saturday: boolean) {
  }
}