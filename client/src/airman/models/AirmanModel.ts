import { AirmanQualificationModel } from './AirmanQualificationModel';
import { EventModel } from '../../event/models/EventModel';
import { AirmanCertificationModel } from './AirmanCertificationModel';

export class AirmanModel {
  static empty(): AirmanModel {
    return new AirmanModel(-1, -1, '', '', [], [], []);
  }

  constructor(public id: number,
              public flightId: number,
              public firstName: string,
              public lastName: string,
              public qualifications: AirmanQualificationModel[] = [],
              public certifications: AirmanCertificationModel[] = [],
              public events: EventModel[] = [],
              public shift?: ShiftType) {
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
}

export enum ShiftType {
  Day = 'Day',
  Swing = 'Swing',
  Night = 'Night',
}