import SiteRepository from './SiteRepository';

interface Uniqueable {
  id: number;
}

function getUniqueIds(items: Uniqueable[]) {
  return items.map(item => item.id).filter((el, i, a) => i === a.indexOf(el));
}

export default function siteRepositoryContract(subject: SiteRepository) {
  describe('findAll', () => {
    it('returns all sites', async () => {
      const sites = await subject.findAll();
      expect(sites).toBeDefined();
      expect(sites.length).toBeGreaterThan(0);
      expect(getUniqueIds(sites).length).toEqual(sites.length);

      const squadrons = sites.map(site => site.squadrons).reduce((x, y) => x.concat(y), []);
      expect(squadrons).toBeDefined();
      expect(squadrons.length).toBeGreaterThan(0);
      expect(getUniqueIds(squadrons).length).toEqual(squadrons.length);

      const flights = squadrons.map(squadron => squadron.flights).reduce((x, y) => x.concat(y), []);
      expect(flights).toBeDefined();
      expect(flights.length).toBeGreaterThan(0);
      expect(getUniqueIds(flights).length).toEqual(flights.length);
    });
  });
}
