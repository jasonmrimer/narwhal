import { Filter } from '../widgets/Filter';

export function forIt(wait: number = 0): Promise<{}> {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
}

/* tslint:disable:no-any*/

export class Table {
  private wrapper: any;

  constructor(subject: any) {
    this.wrapper = subject.find('table');
  }

  getColumnHeaders() {
    return this.wrapper.find('th').map((header: any) => header.text());
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
}

export function findFilterById(wrapper: any, id: string) {
  return wrapper.find(Filter).filterWhere((elem: any) => elem.prop('id') === id);
}

export async function selectOption(wrapper: any, filter: any, value: number) {
  filter.find('select').simulate('change', {target: {value: value}});
  await forIt();
  wrapper.update();
}
