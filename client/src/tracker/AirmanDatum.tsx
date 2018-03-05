import * as React from 'react';
import { TabType } from './stores/SidePanelStore';
import { TrackerStore } from './stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';

export interface Props {
  trackerStore: TrackerStore;
  airman: AirmanModel;
  text: string;
  tab: TabType;
  className: string;
}

export const AirmanDatum = (props: Props) => {
  const {className, trackerStore, airman, tab, text} = props;
  return (
    <td
      className={className}
      onClick={() => trackerStore.setSelectedAirman(airman, tab)}
    >
      {text}
    </td>
  );
};
