import AirmanRepository from '../AirmanRepository';
import AirmanModelFactory from '../../factories/AirmanModelFactory';
import AirmanModel from '../../models/AirmanModel';
import AirmanQualificationModel from '../../models/AirmanQualificationModel';
import AirmanCertificationModelFactory from '../../factories/AirmanCertificationModelFactory';
import AirmanCertificationModel from '../../models/AirmanCertificationModel';

const airmen = [
  AirmanModelFactory.build(1, 1, [AirmanCertificationModelFactory.build(1)]),
  AirmanModelFactory.build(2, 1, [AirmanCertificationModelFactory.build(2)]),
  AirmanModelFactory.build(3, 1, [AirmanCertificationModelFactory.build(3)]),
  AirmanModelFactory.build(4, 2, [AirmanCertificationModelFactory.build(1), AirmanCertificationModelFactory.build(2)]),
  AirmanModelFactory.build(5, 2, [AirmanCertificationModelFactory.build(2)]),
  AirmanModelFactory.build(6, 2, [AirmanCertificationModelFactory.build(3)]),
  AirmanModelFactory.build(7, 3, [AirmanCertificationModelFactory.build(1)]),
  AirmanModelFactory.build(8, 3, [AirmanCertificationModelFactory.build(2)]),
  AirmanModelFactory.build(9, 3, [AirmanCertificationModelFactory.build(3)]),
  AirmanModelFactory.build(10, 4, [AirmanCertificationModelFactory.build(1), AirmanCertificationModelFactory.build(2)]),
  AirmanModelFactory.build(11, 5, [AirmanCertificationModelFactory.build(2)]),
  AirmanModelFactory.build(12, 6, [AirmanCertificationModelFactory.build(3)])
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