import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { SiteManager } from './SiteManager';
import { Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router';
import { SiteManagerStore } from './stores/SiteManagerStore';
import { FlightModel } from '../flight/model/FlightModel';
import { SquadronModel } from '../squadron/models/SquadronModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { ProfileModel } from '../profile/models/ProfileModel';
import { AirmanModel } from '../airman/models/AirmanModel';

describe('SiteManager', () => {
	let airman: AirmanModel;
	let subject: ReactWrapper;

	beforeEach(async () => {
		const siteManagerStore = new SiteManagerStore();

		airman = AirmanModelFactory.build(1, 1);

		const flight1 = new FlightModel(1, 'Flight 1', [airman]);
		const flight2 = new FlightModel(2, 'Flight 2', []);

		const squadron = new SquadronModel(1, 'squad1', [flight1, flight2]);

		siteManagerStore.hydrate(({siteName: 'SITE 14'} as ProfileModel), squadron);

		subject = mount(
			<MemoryRouter>
				<SiteManager siteManagerStore={siteManagerStore}/>
			</MemoryRouter>
		);
	});

	it('should render user\'s site name in the header', () => {
		expect(subject.find('h2').text()).toBe(`SITE 14 Personnel`);
	});

	it('should shows a header above the list of airmen', () => {
		let headers = subject.find('.airmen-header');
		expect(headers.at(0).text()).toBe('NAME');
	});

	it('should render a link to add a new airman', () => {
		const link = subject.find(Link).at(0);
		expect(link.prop('to')).toBe('/flights/new');
	});

	it('should render a link to the airmans profile', () => {
		const link = subject.find(Link).at(1);
		expect(link.prop('to')).toBe(`/flights/${airman.id}`);
	});

	it('should render an New Operator link', () => {
		expect(subject.find('.header').find(Link).prop('to')).toBe('/flights/new');
	});

	it('should render a table for every flight', () => {
		expect(subject.find('.airmen-table').length).toBe(2);
		expect(subject.find('.airman-row').length).toBe(1);
	});
});
