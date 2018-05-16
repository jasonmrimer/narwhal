import { QualificationModel } from '../models/QualificationModel';

export interface QualificationRepository {
  findAllQualifications(): Promise<QualificationModel[]>;
}
