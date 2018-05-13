import { action, computed, observable } from 'mobx';
import { SiteModel } from '../../site/models/SiteModel';
import { UnfilteredValue } from '../inputs/FilterOptionModel';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { FlightModel } from '../../flight/model/FlightModel';

export class LocationFilterStore {
	@observable private _sites: SiteModel[] = [];
	@observable private _selectedSiteId: number = UnfilteredValue;
	@observable private _selectedSquadronId: number = UnfilteredValue;
	@observable private _selectedFlightId: number = UnfilteredValue;

	hydrate(siteId: number, sites: SiteModel[]) {
		this._sites = sites;
		if (this._selectedSiteId !== siteId) {
			this.setSiteId(siteId);
		}
	}

	@computed
	get selectedSiteId() {
		return this._selectedSiteId;
	}

	@action.bound
	setSelectedSite(id: number) {
		this.setSiteId(id);
	}

	@computed
	get siteOptions() {
		return this._sites.map(site => {
			return {value: site.id, label: site.name};
		});
	}

	@computed
	get selectedSquadronId() {
		return this._selectedSquadronId;
	}

	@computed
	get selectedSquadron(): SquadronModel | null {
		const squadrons = findById(this._sites, this._selectedSiteId) as SquadronModel[];
		return squadrons.find(squadron => squadron.id === this._selectedSquadronId) || null;
	}

	@action.bound
	setSelectedSquadron(id: number) {
		this._selectedSquadronId = id;
		this.setSelectedFlight(UnfilteredValue);
	}

	@computed
	get squadronOptions() {
		const site = this._sites.find(s => s.id === this._selectedSiteId);
		if (site == null) {
			return [];
		}

		return site.squadrons.map((squad: SquadronModel) => {
			return {value: squad.id, label: squad.name};
		});
	}

	@computed
	get selectedFlightId() {
		return this._selectedFlightId;
	}

	@action.bound
	setSelectedFlight(id: number) {
		this._selectedFlightId = id;
	}

	@computed
	get flightOptions() {
		const site = this._sites.find(s => s.id === this._selectedSiteId);
		if (site == null) {
			return [];
		}

		const squadron = site.squadrons.find(sq => sq.id === this._selectedSquadronId);
		if (squadron == null) {
			return [];
		}

		return squadron.flights.map(flight => {
			return {value: flight.id, label: flight.name};
		});
	}

	filterAirmen = (airmen: AirmanModel[]) => {
		return airmen
			.filter(this.bySquadron)
			.filter(this.byFlight);
	}

	private bySquadron = (airman: AirmanModel) => {
		return (airman.squadronId === this._selectedSquadronId || this._selectedSquadronId === UnfilteredValue);
	}

	private byFlight = (airman: AirmanModel) => {
		return (airman.flightId === this._selectedFlightId || this._selectedFlightId === UnfilteredValue);
	}

	private setSiteId(siteId: number) {
		this._selectedSiteId = siteId;
		const squadrons = findById(this._sites, this._selectedSiteId);
		if (squadrons.length === 1) {
			this.setSelectedSquadron(squadrons[0].id);
		} else {
			this.setSelectedSquadron(UnfilteredValue);
		}
	}
}

type FilterableItems = SiteModel | SquadronModel | FlightModel;

function findById<T extends FilterableItems>(items: T[], id: number) {
	const item = items.find(itm => itm.id === id);
	if (item) {
		if (item instanceof SiteModel) {
			return item.squadrons;
		} else if (item instanceof SquadronModel) {
			return item.flights;
		}
	}
	return [];
}