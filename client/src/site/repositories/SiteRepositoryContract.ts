import SiteRepository from './SiteRepository';

export default function siteRepositoryContract(subject: SiteRepository) {
  describe('findAll', () => {
    it('returns all sites', async () => {
      const sites = await subject.findAll();
      expect(sites).toBeDefined();
      expect(sites.length).toBeGreaterThan(0);
      const uniqueIds = sites.map(site => site.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(sites.length);
    });
  });
}
