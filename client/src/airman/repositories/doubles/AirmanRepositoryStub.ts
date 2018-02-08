import AirmanRepository from '../AirmanRepository';
import AirmanModelFactory from '../../factories/AirmanModelFactory';
import AirmanModel from '../../models/AirmanModel';
import AirmanCertificationModelFactory from '../../factories/AirmanCertificationModelFactory';
import AirmanQualificationModelFactory from '../../factories/AirmanQualificationModelFactory';
import { Skill } from '../../../skills/models/Skill';
import AirmanQualificationModel from '../../models/AirmanQualificationModel';

const af = AirmanModelFactory;
const airmen = [
  af.build(1, 1, [AirmanQualificationModelFactory.build(1)], [AirmanCertificationModelFactory.build(1)]),
  af.build(2, 1, [AirmanQualificationModelFactory.build(2)], [AirmanCertificationModelFactory.build(2)]),
  af.build(3, 1, [AirmanQualificationModelFactory.build(3)], [AirmanCertificationModelFactory.build(3)]),
  af.build(4, 2, [AirmanQualificationModelFactory.build(1), AirmanQualificationModelFactory.build(2)],
           [AirmanCertificationModelFactory.build(1), AirmanCertificationModelFactory.build(2)]),
  af.build(5, 2, [AirmanQualificationModelFactory.build(2)], [AirmanCertificationModelFactory.build(2)]),
  af.build(6, 2, [AirmanQualificationModelFactory.build(3)], [AirmanCertificationModelFactory.build(3)]),
  af.build(7, 3, [AirmanQualificationModelFactory.build(1)], [AirmanCertificationModelFactory.build(1)]),
  af.build(8, 3, [AirmanQualificationModelFactory.build(2)], [AirmanCertificationModelFactory.build(2)]),
  af.build(9, 3, [AirmanQualificationModelFactory.build(3)], [AirmanCertificationModelFactory.build(3)]),
  af.build(10, 4, [AirmanQualificationModelFactory.build(1), AirmanQualificationModelFactory.build(2)],
           [AirmanCertificationModelFactory.build(1), AirmanCertificationModelFactory.build(2)]),
  af.build(11, 5, [AirmanQualificationModelFactory.build(2)], [AirmanCertificationModelFactory.build(2)]),
  af.build(12, 6, [AirmanQualificationModelFactory.build(3)], [AirmanCertificationModelFactory.build(3)])
];

const squadrons = {'1': airmen.slice(0, 6), '2': airmen.slice(6, 12)};

export default class AirmanRepositoryStub implements AirmanRepository {
  findAll() {
    return Promise.resolve(airmen);
  }

  findBySquadron(id: number) {
    return Promise.resolve(squadrons[String(id)]);
  }

  findByFlight(id: number): Promise<AirmanModel[]> {
    const airmenForFlight = airmen.filter(airman => id === airman.flightId);
    return Promise.resolve(airmenForFlight);
  }

  saveSkill(skill: Skill): Promise<AirmanModel> {
    const airman = airmen.find(a => a.id === skill.airmanId)!;
    if (skill instanceof AirmanQualificationModel) {
      this.save(airman.qualifications, skill);
    } else {
      this.save(airman.certifications, skill);
    }
    return Promise.resolve(airman);
  }

  deleteSkill(skill: Skill): Promise<AirmanModel> {
    const airman = airmen.find(a => a.id === skill.airmanId)!;
    if (skill instanceof AirmanQualificationModel) {
      this.delete(airman.qualifications, skill);
    } else {
      this.delete(airman.certifications, skill);
    }
    return Promise.resolve(airman);
  }

  private save(skills: Skill[], skillToSave: Skill) {
    const existingSkill = skills.find((s: any) => s.id === skillToSave.skillId);
    if (!existingSkill) {
      skillToSave.id = Math.round(Math.random() * 0xFFFFFF);
      skills.push(skillToSave);
    }
  }

  private delete(skills: Skill[], skillToDelete: Skill) {
    const index = skills.indexOf(skillToDelete, 0);
    if (index > -1) {
      skills.splice(index, 1);
    }
  }
}