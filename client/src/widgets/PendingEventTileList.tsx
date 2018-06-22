import styled from 'styled-components';
import * as React from 'react';
import { inject, observer } from 'mobx-react';
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
@inject(
  'pendingEventStore',
  'profileStore'
)
@observer
export class PendingEventTileList extends React.Component<Props> {
  async componentDidMount(): Promise<void> {
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

export const StyledPendingEventTileList = styled(PendingEventTileList)`
    position: absolute;
    background-color: ${props => props.theme.darker};
    border: 1px solid ${props => props.theme.fontColor};
    min-width: 4rem;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 0.25rem;
    cursor: pointer;  
    margin-top: 1.85rem;
    padding: 0.75rem 1rem;
    &:nth-child(odd) {
    /* NOT WORKING*/
      background: ${props => props.theme.purpleSplash};
    }
`;