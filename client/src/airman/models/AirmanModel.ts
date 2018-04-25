import { AirmanQualificationModel } from './AirmanQualificationModel';
import { AirmanCertificationModel } from './AirmanCertificationModel';
import { observable } from 'mobx';

export class AirmanModel {
  @observable public firstName: string;
  @observable public lastName: string;

  static empty(): AirmanModel {
    return new AirmanModel(-1, -1, -1, -1, '', '', [], []);
  }

  constructor(public id: number,
              public flightId: number,
              public squadronId: number,
              public siteId: number,
              firstName: string,
              lastName: string,
              public qualifications: AirmanQualificationModel[] = [],
              public certifications: AirmanCertificationModel[] = [],
              public shift?: ShiftType) {
    this.firstName = firstName;
    this.lastName = lastName;
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