export function forIt(wait: number = 0): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
}

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
