import QualificationModel from "./QualificationModel";

export default interface AirmanModel {
  firstName: string;
  lastName: string;
  qualifications: QualificationModel[];
}