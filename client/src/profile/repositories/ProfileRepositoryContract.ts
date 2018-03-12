import ProfileRepository from './ProfileRepository';

export function ProfileRepositoryContract(subject: ProfileRepository) {
  describe('findOne', () => {
    it('returns an object with a username', async () => {
      const {user} = await subject.findOne();
      expect(user.username).toBeDefined();
      expect(user.siteId).toBeDefined();
    });
  });
}
