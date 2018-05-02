import { AirmanQualificationModel } from './AirmanQualificationModel';
import { AirmanCertificationModel } from './AirmanCertificationModel';
import { observable } from 'mobx';
import { AirmanScheduleModel } from './AirmanScheduleModel';
import { Moment } from 'moment';

export class AirmanModel {
  @observable public firstName: string;
  @observable public lastName: string;
  @observable public siteId: number;
  @observable public squadronId: number;
  @observable public flightId: number;
  @observable public shift?: ShiftType;

  static empty(): AirmanModel {
    return new AirmanModel(-1, -1, -1, -1, '', '', [], [], []);
  }

  constructor(public id: number,
              flightId: number,
              squadronId: number,
              siteId: number,
              firstName: string,
              lastName: string,
              public qualifications: AirmanQualificationModel[] = [],
              public certifications: AirmanCertificationModel[] = [],
              public schedules: AirmanScheduleModel[] = [],
              shift?: ShiftType) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.siteId = siteId;
    this.squadronId = squadronId;
    this.flightId = flightId;
    this.shift = shift;
  }

  get isEmpty() {
    return this.id === -1;
  }

  get hasExpiredSkills() {
    return this.qualifications.map(qualification => qualification.isExpired).some(exp => exp) ||
      this.certifications.map(certification => certification.isExpired).some(exp => exp);
  }

  get qualificationIds() {
    return this.qualifications.map(qual => qual.qualification.id);
  }

  get certificationIds() {
    return this.certifications.map(cert => cert.certification.id);
  }

  get currentAirmanSchedule() {
    return this.schedules.find(as => as.endDate === null);
  }

  get currentScheduleId() {
    const airmanSchedule = this.currentAirmanSchedule;
    if (airmanSchedule) {
      return airmanSchedule.schedule.id;
    } else {
      return null;
    }
  }

  isAvailableForWork(day: Moment) {
    const schedulesBeforeDay = this.schedules.filter(schedule => {
      return schedule.startDate.isSameOrBefore(day);
    });

    if (schedulesBeforeDay) {
      const currentSchedule = schedulesBeforeDay.find(schedule => schedule.endDate === null);
      if (currentSchedule) {
        return currentSchedule.isScheduledWorkDay(day);
      } else {
        const pastSchedule = schedulesBeforeDay.find(schedule => day.isBetween(schedule.startDate, schedule.endDate!));
        if (pastSchedule) {
          return pastSchedule.isScheduledWorkDay(day);
        }
      }
    }
    return true;
  }
}

export enum ShiftType {
  Day = 'Day',
  Swing = 'Swing',
  Night = 'Night',
}