export class FlightModel {
  public static empty() {
    return new FlightModel(-1, '', -1);
  }

  constructor(public id: number,
              public name: string,
              public squadronId: number
  ) {
  }
}
