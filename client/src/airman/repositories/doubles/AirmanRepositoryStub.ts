import AirmanRepository from '../AirmanRepository';
import AirmanModelFactory from '../../factories/AirmanModelFactory';
import AirmanModel from '../../models/AirmanModel';
import AirmanQualificationModel from '../../models/AirmanQualificationModel';
import AirmanCertificationModelFactory from '../../factories/AirmanCertificationModelFactory';
import AirmanCertificationModel from '../../models/AirmanCertificationModel';
import AirmanQualificationModelFactory from '../../factories/AirmanQualificationModelFactory';

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

  saveQualification(airmanQual: AirmanQualificationModel): Promise<AirmanModel> {
    const airman = airmen.find(a => a.id === airmanQual.airmanId)!;
    const qual = airman.qualifications.find((q: AirmanQualificationModel) => q.id === airmanQual.qualification.id);
    if (qual == null) {
      airmanQual.id = Math.round(Math.random() * 0xFFFFFF);
      airman.qualifications.push(airmanQual);
    }
    return Promise.resolve(airman);
  }

  saveCertification(airmanCert: AirmanCertificationModel): Promise<AirmanModel> {
    const airman = airmen.find(a => a.id === airmanCert.airmanId)!;
    const cert = airman.certifications.find((c: AirmanCertificationModel) => c.id === airmanCert.certification.id);
    if (cert == null) {
      airmanCert.id = Math.round(Math.random() * 0xFFFFFF);
      airman.certifications.push(airmanCert);
    }
    return Promise.resolve(airman);
  }
}