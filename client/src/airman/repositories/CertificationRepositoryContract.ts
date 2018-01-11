import CertificationRepository from './CertificationRepository';

export default function CertificationRepositoryContract(subject: CertificationRepository) {
  describe('findAll', () => {
    it('returns all certifications', async () => {
      const certs = await subject.findAll();

      expect(certs).toBeDefined();

      expect(certs.length).toBeGreaterThan(0);

      const uniqueIds = certs.map(cert => cert.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(certs.length);
    });
  });
}
