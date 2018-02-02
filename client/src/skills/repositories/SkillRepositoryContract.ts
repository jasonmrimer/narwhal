import QualificationRepository from './SkillRepository';

export default function SkillRepositoryContract(subject: QualificationRepository) {
  describe('findAllQualifications', () => {
    it('returns a list of all qualifications', async () => {
      const qualifications = await subject.findAllQualifications();
      assertFindAll(qualifications);
    });
  });

  describe('findAllCertificaions', () => {
    it('returns a list of all certifications', async () => {
      const certifications = await subject.findAllCertifications();
      assertFindAll(certifications);
    });
  });
}

function assertFindAll(items: { id: number }[]) {
  expect(items).toBeDefined();
  expect(items.length).toBeGreaterThan(0);
  const uniqueIds = items.map(item => item.id).filter((el, i, a) => i === a.indexOf(el));
  expect(uniqueIds.length).toEqual(items.length);
}