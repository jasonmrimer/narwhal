import { SiteManagerStore } from './SiteManagerStore';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { FlightModel } from '../../flight/model/FlightModel';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';

describe('SiteManagerStore', () => {
	let subject: SiteManagerStore;
	let squadron: SquadronModel;
	let flight1: FlightModel;
	let flight2: FlightModel;

	beforeEach(async () => {
		subject = new SiteManagerStore();
		const airman = AirmanModelFactory.build();
		airman.flightId = 1;
		flight1 = new FlightModel(1, 'Flight 1', [airman]);
		flight2 = new FlightModel(2, 'Flight 2', []);
		squadron = new SquadronModel(1, 'squad1', [flight1, flight2]);
		await subject.hydrate(({siteName: 'SITE 14'} as ProfileModel), squadron);
	});

	it('should provide the current site', () => {
		expect(subject.siteName).toBe('SITE 14');
	});

	it('should give the flights with their airmen', () => {
		expect(subject.squadron.flights.length).toBe(2);
		expect(subject.squadron.flights[0].airmen.length).toBe(1);
	});
});
