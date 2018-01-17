import { action, computed, observable } from 'mobx';

import { FilterableStore } from '../stores/FilterableStore';
import { SquadronStore } from '../squadron/SquadronStore';

export class FlightStore implements FilterableStore {
  @observable private selectedFlightId: number = -1;

  constructor(private squadronStore: SquadronStore) {
  }

  @action
  filterByFlightId(id: number) {
    this.selectedFlightId = id;
  }

  @action
  setSelectedFlightId(id: number) {
    this.selectedFlightId = id;
  }

  @computed
  get currentOptionId() {
    return this.selectedFlightId;
  }

  @computed
  get options() {
    const selectedSquadronId = this.squadronStore.currentOptionId;
    const squadrons = this.squadronStore.squadrons;
    const selectedSquadron = squadrons.find(squadron => squadron.id === selectedSquadronId);
    if (selectedSquadron) {
      return selectedSquadron.flights.map((flight) => ({value: flight.id, label: flight.name}));
    }
    return [];
  }

  @computed
  get isDisabled() {
    return this.squadronStore.currentOptionId === -1;
  }
}