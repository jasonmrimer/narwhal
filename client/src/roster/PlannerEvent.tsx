import * as React from 'react';
import { OffDayIcon } from '../icons/OffDayIcon';
import styled from 'styled-components';
import { AvailableIcon } from '../icons/AvailableIcon';
import { SidePanelActions } from '../tracker/SidePanelActions';
import { inject, observer } from 'mobx-react';
import { TabType } from '../tracker/stores/SidePanelStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { Moment } from 'moment';
import { DailyEvents } from './models/DailyEvents';
import { TrackerStore } from '../tracker/stores/TrackerStore';

interface Props {
  airman: AirmanModel;
  day: Moment;
  trackerStore?: TrackerStore;
  sidePanelActions?: SidePanelActions;
}

@observer
export class PlannerEvent extends React.Component<Props> {
  onClick = async (e: any) => {
    e.stopPropagation();
    await this.props.trackerStore!.performLoading(async () => {
      const {airman, day, sidePanelActions} = this.props;
      await sidePanelActions!.openSidePanel(airman, TabType.AVAILABILITY, day);
    });
  }

  render() {
    const {airman, day, trackerStore} = this.props;
    const dailyEvents = new DailyEvents(trackerStore!.getDailyEventsByAirmanId(airman.id, day));
    if (dailyEvents.isEmpty()) {
      return airman.isAvailableForWork(day)
        ? <AvailableIcon onClick={this.onClick}/>
        : <OffDayIcon onClick={this.onClick}/>;
    } else {
      return dailyEvents.renderEvent();
    }
  }
}

export const StyledPlannerEvent = inject(
  'sidePanelActions',
  'trackerStore'
)(styled(PlannerEvent)`

`);