import { Filter } from '../widgets/inputs/Filter';
import { Action, Location } from 'history';
import { Ability } from '@casl/ability';

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

export function findByClassName(wrapper: any, className: string) {
  return wrapper.findWhere((e: any) => e.prop('className') === className);
}

export const historyMock = {
  length: 0,
  action: ('PUSH' as Action),
  location: ({state: ''} as Location),
  push: jest.fn(),
  replace: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  block: jest.fn(),
  listen: jest.fn(),
  createHref: jest.fn(),
};

export function makeFakeProfile(roleName: string, ability: Ability) {
  return {
    id: 1,
    username: 'Tytus',
    siteId: 14,
    siteName: '14',
    roleName: roleName,
    roleId: 1,
    classified: false,
    ability: ability
  };
}