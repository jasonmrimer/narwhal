import QualificationModel from './QualificationModel';
import UnitModel from '../../tracker/models/UnitModel';

export default interface AirmanModel {
  firstName: string;
  lastName: string;
  qualifications: QualificationModel[];
  unit: UnitModel;
}