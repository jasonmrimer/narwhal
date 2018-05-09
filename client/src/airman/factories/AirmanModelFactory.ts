import { AirmanCertificationModel } from '../models/AirmanCertificationModel';
import { AirmanQualificationModel } from '../models/AirmanQualificationModel';
import { AirmanModel, ShiftType } from '../models/AirmanModel';
import { randomText } from '../../utils/randomizer';
import { AirmanScheduleModel } from '../models/AirmanScheduleModel';
import { RankModel } from '../../rank/models/RankModel';

export class AirmanModelFactory {
  static build(id: number = 1,
               flightId: number = 1,
               squadronId: number = 1,
               siteId: number = 1,
               rank: RankModel = new RankModel(1, 'No Rank'),
               qualifications: AirmanQualificationModel[] = [],
               certifications: AirmanCertificationModel[] = [],
               schedules: AirmanScheduleModel[] = [],
               shift: ShiftType = randomShiftType()) {
    return new AirmanModel(
      id,
      flightId,
      squadronId,
      siteId,
      randomText(5),
      randomText(5),
      rank,
      qualifications,
      certifications,
      schedules,
      shift
    );
  }

  static buildList(amount: number = 1, start: number = 1) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(start + i);
    });
  }
}

function randomShiftType(): ShiftType {
  const shiftArray = ['Day', 'Swing', 'Night'];
  return ShiftType[shiftArray[Math.floor(Math.random() * shiftArray.length)]];
}
