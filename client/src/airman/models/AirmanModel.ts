import QualificationModel from '../../qualification/models/QualificationModel';
import UnitModel from '../../unit/models/UnitModel';

export default interface AirmanModel {
  firstName: string;
  lastName: string;
  qualifications: QualificationModel[];
  unit: UnitModel;
}