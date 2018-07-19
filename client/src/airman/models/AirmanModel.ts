import { AirmanQualificationModel } from './AirmanQualificationModel';
import { AirmanCertificationModel } from './AirmanCertificationModel';
import { observable } from 'mobx';
import { AirmanScheduleModel } from './AirmanScheduleModel';
import { Moment } from 'moment';
import { RankModel } from '../../rank/models/RankModel';

export class AirmanModel {
  @observable public firstName: string;
  @observable public lastName: string;
  @observable public siteId: number;
  @observable public squadronId: number;
  @observable public flightId: number;
  @observable public rank: RankModel;
  @observable public shift?: ShiftType;
  @observable public remarks?: string;

  static empty(): AirmanModel {
    return new AirmanModel(-1, -1, -1, -1, '', '', new RankModel(-1, ''), [], [], []);
  }

  constructor(public id: number,
              flightId: number,
              squadronId: number,
              siteId: number,
              firstName: string,
              lastName: string,
              rank: RankModel,
              public qualifications: AirmanQualificationModel[] = [],
              public certifications: AirmanCertificationModel[] = [],
              public schedules: AirmanScheduleModel[] = [],
              shift?: ShiftType,
              remarks?: string
    ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.siteId = siteId;
    this.squadronId = squadronId;
    this.flightId = flightId;
    this.rank = rank;
    this.shift = shift;
    this.remarks = remarks;
  }

  get fullName() {
    if (this.lastName.length === 0 && this.firstName.length === 0) {
      return '';
    }
    const fullName = this.rank.abbreviation === 'No Rank' ? '' : this.rank.abbreviation + ' ';
    return fullName +
      `${this.lastName}${this.lastName.length > 0 && this.firstName.length > 0 ? ',' : ''} ${this.firstName}`;
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
        return currentSchedule.schedule.isScheduledWorkDay(day);
      } else {
        const pastSchedule = schedulesBeforeDay.find(schedule => day.isBetween(schedule.startDate, schedule.endDate!));
        if (pastSchedule) {
          return pastSchedule.schedule.isScheduledWorkDay(day);
        }
      }
    }
    return true;
  }
}

export const DaysToExpiration = 14;

export enum ShiftType {
  Day = 'Day',
  Swing = 'Swing',
  Night = 'Night',
}