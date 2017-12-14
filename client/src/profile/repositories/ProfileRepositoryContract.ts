import ProfileRepository from './ProfileRepository';

export default function ProfileRepositoryContract(subject: ProfileRepository) {
  describe('findOne', () => {
    it('returns an object with a username', async () => {
      const profile = await subject.findOne();
      expect(profile.username).toBeDefined();
    });
  });
}
