import styled from 'styled-components';
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { StyledPendingEventTile } from './PendingEventTile';
import { EventModel } from '../event/models/EventModel';
import { PendingEventStore } from './stores/PendingEventStore';
import { WebRepositories } from '../utils/Repositories';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { findDOMNode } from 'react-dom';

interface Props {
  pendingEventStore?: PendingEventStore;
  profileStore?: ProfileSitePickerStore;
  history?: any;
  className?: string;
}

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

  componentWillMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = (e: any) => {
    if (!findDOMNode(this).contains(e.target)) {
      this.props.pendingEventStore!.setShowList();
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        {
          this.props.pendingEventStore!.events.map((event: EventModel, index: number) => {
              return (
                <div className="tile" key={index}>
                  <StyledPendingEventTile
                    event={event}
                    airman={this.props.pendingEventStore!.findAirman(event.airmanId)}
                    site={this.props.pendingEventStore!.site}
                    history={this.props.history}
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
)
(styled(PendingEventTileList)`
    position: absolute;
    border: 1px solid ${props => props.theme.fontColor};
    min-width: 4rem;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 0.25rem;
    margin-top: 1.85rem;

    .tile {
      border-bottom: 1px solid ${props => props.theme.fontColor};
    }
    .tile:nth-child(odd) {
      background: ${props => props.theme.dark};
    }
  
    .tile:nth-child(even) {
      background: ${props => props.theme.light};
    }
    
    .tile:last-child {
      border-bottom: none;
    }
`);