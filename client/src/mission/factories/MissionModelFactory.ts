import * as moment from 'moment';

const missionOne = {
  missionId: 'missionId1',
  atoMissionNumber: 'ato1',
  startDateTime: moment.utc('2018-01-01T01:00:00Z'),
  endDateTime: moment.utc('2018-01-01T11:00:00Z'),
  site: {id: 1, name: 'Site 1'}
};

const missionTwo = {
  missionId: 'missionId2',
  atoMissionNumber: 'ato2',
  startDateTime: moment.utc('2018-02-02T02:00:00Z'),
  endDateTime: moment.utc('2018-02-02T14:00:00Z'),
  site: {id: 1, name: 'Site 1'}
};

const missionThree = {
  missionId: 'missionId3',
  atoMissionNumber: 'ato3',
  startDateTime: moment.utc('2018-03-03T03:00:00Z'),
  endDateTime: moment.utc('2018-03-04T03:00:00Z'),
  site: {id: 2, name: 'Site 2'}
};

const missions = [missionOne, missionTwo, missionThree];

export default class MissionModelFactory {
  static buildList() {
    return missions;
  }

  static buildForSite(siteId: number) {
    return missions.filter((mission) => mission.site.id === siteId);
  }

  static build() {
    return missionOne;
  }
}