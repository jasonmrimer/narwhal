import { AirmanModel } from '../../airman/models/AirmanModel';

export enum SubHeaderType {
  Available,
  Unavailable
}

export class SubHeader {
  static Available() {
    return new SubHeader(SubHeaderType.Available);
  }

  static Unavailable() {
    return new SubHeader(SubHeaderType.Unavailable);
  }

  constructor(readonly type: SubHeaderType) {
  }

  text() {
    return SubHeaderType[this.type].toUpperCase();
  }
}

export class EmptyNotification {
  static NoneAvailable() {
    return new EmptyNotification('No personnel currently available.');
  }

  static NoneAssigned() {
    return new EmptyNotification('All personnel available.');
  }

  static NoneFound() {
    return new EmptyNotification('No personnel at this location match your search.');
  }

  constructor(readonly text: string) {
  }
}

export type MissionPlannerRosterListItem = AirmanModel | SubHeader | EmptyNotification;

type AirmenFilter = (airmen: AirmanModel[]) => AirmanModel[];

export class MissionPlannerRosterList {
  private list: MissionPlannerRosterListItem[] = [];

  constructor(availableAirmen: AirmanModel[], unavailableAirmen: AirmanModel[], ...filters: AirmenFilter[]) {
    const availableList: MissionPlannerRosterListItem[] = [SubHeader.Available()];
    if (availableAirmen.length === 0) {
      availableList.push(EmptyNotification.NoneAvailable());
    } else {
      availableList.push(...this.applyFilters(filters, availableAirmen));
    }

    const unavailableList: MissionPlannerRosterListItem[] = [SubHeader.Unavailable()];
    if (unavailableAirmen.length === 0) {
      unavailableList.push(EmptyNotification.NoneAssigned());
    } else {
      unavailableList.push(...this.applyFilters(filters, unavailableAirmen));
    }

    this.list = [...availableList, ...unavailableList];
  }

  get(index: number): MissionPlannerRosterListItem {
    return this.list[index];
  }

  get size() {
    return this.list.length;
  }

  private applyFilters(filters: AirmenFilter[], airmen: AirmanModel[]) {
    filters.forEach(filter => {
      airmen = filter(airmen);
    });

    if (airmen.length === 0) {
      return [EmptyNotification.NoneFound()];
    } else {
      return airmen;
    }
  }
}