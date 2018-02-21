import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Crew } from './Crew';
import { CrewStore } from './stores/CrewStore';
import { CrewRepositoryStub } from './repositories/doubles/CrewRepositoryStub';
import { CrewModelFactory } from './factories/CrewModelFactory';

describe('Crew', () => {
  let subject: ShallowWrapper;

  const crewModel = CrewModelFactory.build();
  const mission = crewModel.mission;
  const crewPositions = crewModel.crewPositions;

  beforeEach(async () => {
    const crewStore = new CrewStore(new CrewRepositoryStub(crewModel));
    subject = shallow(
      <Crew
        crewId={crewModel.id}
        crewStore={crewStore}
      />
    );
  });

  it('displays the mission details', () => {
    subject.update();
    expect(subject.text()).toContain(mission.atoMissionNumber);
    expect(subject.text()).toContain(`MSN DATE ${mission.displayDate}`);
    expect(subject.text()).toContain(`MSN START ${mission.displayStartTime}`);
    expect(subject.text()).toContain(`MSN END ${mission.displayEndTime}`);
  });

  it('displays Airmen on the mission', () => {
    subject.update();
    crewPositions.forEach(crewPosition => expect(subject.text()).toContain(crewPosition.airman.lastName));
  });
});
