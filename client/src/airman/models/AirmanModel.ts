import QualificationModel from '../../qualification/models/QualificationModel';
import UnitModel from '../../unit/models/UnitModel';
import CertificationModel from '../../certification/models/CertificationModel';

export default interface AirmanModel {
  firstName: string;
  lastName: string;
  qualifications: QualificationModel[];
  certifications: CertificationModel[];
  unit: UnitModel;
}