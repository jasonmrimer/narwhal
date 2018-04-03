import { AirmanCertificationModel } from '../models/AirmanCertificationModel';
import { AirmanQualificationModel } from '../models/AirmanQualificationModel';
import { AirmanModel, ShiftType } from '../models/AirmanModel';
import { randomText } from '../../utils/randomizer';

export class AirmanModelFactory {
  static build(id: number = 1,
               flightId: number = 1,
               squadronId: number = 1,
               siteId: number = 1,
               qualifications: AirmanQualificationModel[] = [],
               certifications: AirmanCertificationModel[] = []) {
    return new AirmanModel(
      id,
      flightId,
      squadronId,
      siteId,
      randomText(5),
      randomText(5),
      qualifications,
      certifications,
      randomShiftType()
    );
  }
}

function randomShiftType(): ShiftType {
  const shiftArray = ['Day', 'Swing', 'Night'];
  return ShiftType[shiftArray[Math.floor(Math.random() * shiftArray.length)]];
}
