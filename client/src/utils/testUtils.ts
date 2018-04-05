import { Filter } from '../widgets/Filter';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { ReactWrapper } from 'enzyme';
import { DoubleRepositories } from '../Repositories';

export async function makeFakeTrackerStore(shouldHydrateState: boolean = true) {
  const siteId = 14;
  const store = new TrackerStore(DoubleRepositories, new TimeServiceStub());
  if (shouldHydrateState) {
    await store.hydrate(siteId);
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

export const clickOnFirstAirman = (wrapper: any) => wrapper.find('.airman-name').first().simulate('click');

export function clickButtonByName(wrapper: ReactWrapper, component: any, className: string) {
  findByClassName(wrapper.find(component).find('button'), className).simulate('click');
}

export function findByClassName(wrapper: any, className: string) {
  return wrapper.findWhere((e: any) => e.prop('className') === className);
}
