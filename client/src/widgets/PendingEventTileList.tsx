import styled from 'styled-components';
import * as React from 'react';
import { inject } from 'mobx-react';
import { StyledPendingEventTile } from './PendingEventTile';
import { EventModel } from '../event/models/EventModel';
import { PendingEventStore } from './stores/PendingEventStore';
import { WebRepositories } from '../utils/Repositories';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';

interface Props {
  pendingEventStore?: PendingEventStore;
  profileStore?: ProfileSitePickerStore;
  className?: string;
}

export class PendingEventTileList extends React.Component<Props> {
  async componentDidMount() {
    const siteId = this.props.profileStore!.profile!.siteId!;

    await this.props.pendingEventStore!.performLoading(async () => {
      const [airmen, events, site] = await Promise.all([
        WebRepositories.airmanRepository.findBySiteId(siteId),
        WebRepositories.eventRepository.findAllPendingEventsBySiteId(siteId),
        WebRepositories.siteRepository.findOne(siteId)
      ]);
      this.props.pendingEventStore!.hydrate(airmen, events, site);
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        {
          this.props.pendingEventStore!.events.map((event: EventModel, index: number) => {
              return (
                <div key={index}>
                  <StyledPendingEventTile
                    event={event}
                    airman={this.props.pendingEventStore!.findAirman(event.airmanId)}
                    site={this.props.pendingEventStore!.site}
                  />
                </div>
              );
            }
          )
        }
      </div>
    );
  }
}

export const StyledPendingEventTileList = inject(
  'pendingEventStore',
  'profileStore'
)(styled(PendingEventTileList)`

`);