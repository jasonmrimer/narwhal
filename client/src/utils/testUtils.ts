import {ReactWrapper} from "enzyme";

export function forIt(wait: number = 0): Promise<{}> {
    return new Promise((resolve) => {
      setTimeout(resolve, wait);
    });
  }

export class Table {
  private wrapper: ReactWrapper;

  constructor(subject: ReactWrapper) {
    this.wrapper = subject.find('table');
  }

  getColumnHeaders() {
    return this.wrapper.find('th').map((header) => header.text());
  }

  getTextForRowAndCol(rowIndex: number, columnName: string) {
    const columnIndex = this.getColumnHeaders().findIndex(header => header === columnName);
    const row = this.getRows().at(rowIndex);
    return row.find('td').at(columnIndex).text();
  }

  getRows() {
    return this.wrapper.find('tbody tr')
  }

  getRowCount() {
    return this.getRows().length;
  }
}

