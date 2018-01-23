import { Filter } from '../widgets/Filter';
import AvailabilityOverview from '../roster/AvailabilityOverview';
import TrackerStore from '../tracker/stores/TrackerStore';
import AirmanRepositoryStub from '../airman/repositories/doubles/AirmanRepositoryStub';
import SiteRepositoryStub from '../site/repositories/doubles/SiteRepositoryStub';
import CertificationRepositoryStub from '../airman/repositories/doubles/CertificationRepositoryStub';
import EventRepositoryStub from '../event/repositories/doubles/EventRepositoryStub';
import PlannerServiceStub from '../tracker/services/doubles/PlannerServiceStub';

export async function makeFakeTrackerStore() {
  const store = new TrackerStore(
    new AirmanRepositoryStub(),
    new SiteRepositoryStub(),
    new CertificationRepositoryStub(),
    new EventRepositoryStub(),
    new PlannerServiceStub(),
  );
  await store.hydrate();
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

  getAvailabilityOverview() {
    return this.wrapper.find(AvailabilityOverview);
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

export function selectOptionByValue(wrapper: any, value: number) {
  const input = wrapper.find('input');
  input.simulate('keyDown', {keyCode: 40});

  const options = wrapper.prop('options');
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === value) {
      input.simulate('keyDown', {keyCode: 13});
      return;
    }
    input.simulate('keyDown', {keyCode: 40});
  }
}
