export enum SkillType {
  Qualification = 'Qualification',
  Certification = 'Certification'
}

export const allSkills = () => {
  return [
    SkillType.Qualification,
    SkillType.Certification
  ];
};