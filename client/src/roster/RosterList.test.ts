import { SquadronModel } from '../squadron/models/SquadronModel';
import { FlightModel } from '../flight/model/FlightModel';
import { AirmanModel } from '../airman/models/AirmanModel';
import { RosterList } from './RosterList';
import { UnfilteredValue } from '../widgets/models/FilterOptionModel';

describe('RosterList', () => {
  const squadron = new SquadronModel(1, 'Squadron 1', [
    new FlightModel(1, 'Flight 1'),
    new FlightModel(2, 'Flight 2'),
    new FlightModel(3, 'Flight 3'),
    new FlightModel(4, 'Flight 4')
  ]);
  const airmen = [
    new AirmanModel(1, 1, 1, 1, '1', '1'),
    new AirmanModel(2, 2, 1, 1, '2', '2'),
    new AirmanModel(3, 3, 1, 1, '3', '3')
  ];

  describe('with a squadron', () => {
    it('should return a list with flight headers', () => {
      const list = new RosterList(UnfilteredValue, squadron, airmen);
      expect(list.size).toEqual(squadron.flights.length + airmen.length + 1);
      expect(list.get(0)).toEqual(squadron.flights[0]);
      expect(list.get(1)).toEqual(airmen[0]);
      expect(list.get(2)).toEqual(squadron.flights[1]);
      expect(list.get(3)).toEqual(airmen[1]);
      expect(list.get(4)).toEqual(squadron.flights[2]);
      expect(list.get(5)).toEqual(airmen[2]);
      expect(list.get(6)).toEqual(squadron.flights[3]);
      expect(list.get(7)).toEqual('No members match your search.');
    });
  });

  describe('without a squadron', () => {
    it('should return the original list of airmen without headers', () => {
      const list = new RosterList(UnfilteredValue, null, airmen);
      expect(list.size).toEqual(airmen.length);
      airmen.forEach((a, i) => {
        expect(a).toEqual(list.get(i));
      });
    });
  });
});