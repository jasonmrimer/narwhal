export enum ScheduleType {
  NoSchedule = 'No Schedule',
  FrontHalf = 'Front Half',
  BackHalf = 'Back Half',
  MondayToFriday = 'Monday - Friday'
}

export class ScheduleModel {
  constructor(public id: number,
              public type: ScheduleType,
              public sunday: boolean = true,
              public monday: boolean = true,
              public tuesday: boolean = true,
              public wednesday: boolean = true,
              public thursday: boolean = true,
              public friday: boolean = true,
              public saturday: boolean = true) {
  }
}