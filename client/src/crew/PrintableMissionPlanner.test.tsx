import { shallow, ShallowWrapper } from 'enzyme';
import { PrintableMissionPlanner } from './PrintableMissionPlanner';
import * as React from 'react';
import { CrewModelFactory } from './factories/CrewModelFactory';

describe('PrintabelMissionPlanner', () => {
  const crew = CrewModelFactory.build();
  let subject: ShallowWrapper;

  beforeEach(() => {
    subject = shallow(
      <PrintableMissionPlanner crew={crew}/>
    );
  });

  it('should render mission details', () => {
    expect(subject.find('h3').text()).toContain(crew.mission.atoMissionNumber);
    const missionDetails = subject.find('.mission-details');
    expect(missionDetails.find('span').at(0).text()).toContain(crew.mission.displayDateZulu);
    expect(missionDetails.find('span').at(1).text()).toContain(crew.mission.displayStartTime);
    expect(missionDetails.find('span').at(2).text()).toContain(crew.mission.displayEndTime);
  });

  it('should render each crew row with critical, position and crew member name', () => {
    expect(subject.find('.crew-row').length).toBe(crew.crewPositions.length + PrintableMissionPlanner.emptyRows);

    const position = crew.crewPositions[0];
    expect(subject.find('.crew-row').at(0).text()).toContain(position.displayFullName);
    expect(subject.find('.crew-row').at(0).text()).toContain(position.title);
    expect(subject.find('.crew-row').at(0).text()).not.toContain('*');
  });
});