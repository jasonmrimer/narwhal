import { Filter } from '../widgets/Filter';
import { Planner } from '../roster/planner/Planner';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanRepositoryStub } from '../airman/repositories/doubles/AirmanRepositoryStub';
import { SiteRepositoryStub } from '../site/repositories/doubles/SiteRepositoryStub';
import { EventRepositoryStub } from '../event/repositories/doubles/EventRepositoryStub';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { default as SkillRepositoryStub } from '../skills/repositories/doubles/SkillRepositoryStub';
import { Moment } from 'moment';
import { MissionRepositoryStub } from '../mission/repositories/doubles/MissionRepositoryStub';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { PlannerStore } from '../roster/planner/stores/PlannerStore';
import { MissionStore } from '../mission/stores/MissionStore';

export async function makeFakeTrackerStore(shouldHydrateState: boolean = true) {
  const store = new TrackerStore(
    new AirmanRepositoryStub(),
    new SiteRepositoryStub(),
    new SkillRepositoryStub(),
    new EventRepositoryStub(),
    new CurrencyStore(),
    new AvailabilityStore(),
    new PlannerStore(new TimeServiceStub()),
    new MissionStore(new MissionRepositoryStub()),
  );
  if (shouldHydrateState) {
    await store.hydrate();
  }
  return store;
}

export function forIt(wait: number = 0): Promise<{}> {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
}

/* tslint:disable:no-empty */
export const eventStub = {
  preventDefault: () => {
  },
  stopPropagation: () => {
  }
};

/* tslint:disable:no-any */
export const eventTargetStub = (name: string, value: any) => {
  return {
    target: {
      name: name,
      value: value
    }
  };
};

/* tslint:disable:no-any */
export function selectValueFromDropdown(wrapper: any, name: string, value: any) {
  wrapper.find(`select[name="${name}"]`).simulate('change', eventTargetStub(name, value));
}

export function inputValueForDatePicker(wrapper: any, name: string, value: Moment) {
  wrapper.find(`input[name="${name}"]`).simulate('change', eventTargetStub(name, value.format('YYYY-MM-DD')));
}

/* tslint:disable:no-any*/
export class Table {
  private wrapper: any;

  constructor(subject: any) {
    this.wrapper = subject.find('table');
  }

  getColumnHeaders() {
    const headers = this.wrapper.find('th');
    return headers.map((header: any) => header.childAt(0).text());
  }

  getTextForRowAndCol(rowIndex: number, columnName: string) {
    const columnIndex = this.getColumnHeaders().findIndex((header: any) => header === columnName);
    const row = this.getRows().at(rowIndex);
    return row.find('td').at(columnIndex).text();
  }

  getRows() {
    return this.wrapper.find('tbody tr');
  }

  getRowCount() {
    return this.getRows().length;
  }

  getPlanner() {
    return this.wrapper.find(Planner);
  }

  getColumnSubHeaders(columnIndex: number) {
    const headers = this.wrapper.find('th');
    return headers.at(columnIndex).childAt(1).text();
  }
}

export function findFilterById(wrapper: any, id: string) {
  return wrapper.find(Filter).filterWhere((elem: any) => elem.prop('id') === id);
}

export async function selectOption(wrapper: any, filter: any, value: number) {
  filter.find('select').simulate('change', {target: {value: value}});
  await forIt();
  wrapper.update();
}

export function findSelectorWithText(wrapper: any, selector: string, text: string): any {
  return wrapper.find(selector).filterWhere((x: any) => x.text().includes(text));
}
