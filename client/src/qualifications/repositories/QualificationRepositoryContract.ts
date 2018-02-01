import QualificationRepository from './QualificationRepository';
import QualificationModel from '../models/QualificationModel';

export default function QualificationRepositoryContract(subject: QualificationRepository) {
  let qualifications: QualificationModel[];

  describe('findAll', () => {
    beforeEach( async() => {
      qualifications = await subject.findAll();
      expect(qualifications).toBeDefined();

    });

    it('returns a list of all qualifications', () => {
      expect(qualifications.length).toBeGreaterThan(0);
    });
  });
}
