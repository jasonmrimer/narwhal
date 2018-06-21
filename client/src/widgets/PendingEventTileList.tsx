import styled from 'styled-components';
import * as React from 'react';
import { inject } from 'mobx-react';
import { StyledPendingEventTile } from './PendingEventTile';
import { EventModel } from '../event/models/EventModel';
import { AirmanModel } from '../airman/models/AirmanModel';
import { PendingEventStore } from './stores/PendingEventStore';

interface Props {
  pendingEventStore?: PendingEventStore;
  className?: string;
}

export const PendingEventTileList = (props: Props) => {
  return (
    <div className={props.className}>
      {
        props.pendingEventStore!.events.map((event: EventModel) => {
            if (airman) {
              return (
                <StyledPendingEventTile
                  event={event}
                  airman={airman}
                  site={props.pendingEventStore!.site}
                />
              );
            }
            return;
          }
        )
      }
    </div>
  );
}

export const StyledPendingEventTileList = inject(
  'PendingEventStore'
)(styled(PendingEventTileList)`

`);