import * as React from 'react';
import styled from 'styled-components';
import { SiteManagerStore } from './stores/SiteManagerStore';
import { observer } from 'mobx-react';
import { CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';
import { BorderedNotification } from '../widgets/Notification';
import { AirmanModel } from '../airman/models/AirmanModel';
import { Link } from 'react-router-dom';

interface Props {
  siteManagerStore: SiteManagerStore;
  className?: string;
}

const cache = new CellMeasurerCache({
  defaultHeight: 60,
  fixedWidth: true
});

interface RowProps {
  airman: AirmanModel;
  style: object;
  index: number;
  parent: any;
  key: any;
  className?: string;
}

const Row = observer((props: RowProps) => {
  const {airman} = props;
  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      rowIndex={props.index}
      key={props.key}
      parent={props.parent}
    >
      <div className={props.className} style={props.style}>
        <Link to={`/flights/${airman.id}`}>
          <div className="airman-row">
          <span className="airman-name">
            {airman.lastName}, {airman.firstName}
         </span>
          </div>
        </Link>
      </div>
    </CellMeasurer>
  );
});

@observer
export class SiteManager extends React.Component<Props> {
  async componentDidMount() {
    await this.props.siteManagerStore.hydrate();
  }

  render() {
    const {siteManagerStore, className} = this.props;
    cache.clearAll();
    return (
      <div className={this.props.className}>
        <h2>{this.props.siteManagerStore.siteName} Personnel</h2>
        <div className="airmen-table">
          <div className="airmen-header">
            <span>NAME</span>
          </div>
          <List
            className={className}
            height={855}
            rowHeight={(props) => cache.rowHeight(props)! || 60}
            rowCount={siteManagerStore.airmen.length}
            width={798}
            overscanRowCount={15}
            deferredMeasurementCache={cache}
            noRowsRenderer={() => {
              return (
                <BorderedNotification>
                  No members at this site.
                </BorderedNotification>
              );
            }}
            rowRenderer={(props: ListRowProps) => {
              const airman = siteManagerStore.airmen[props.index];
              return (
                <StyledRow
                  {...props}
                  airman={airman}
                  key={airman.id}
                  style={props.style}
                />
              );
            }}
          />
        </div>
      </div>
    );
  }
}

export const StyledRow = styled(Row)`
  a {
    text-decoration: none;
    color: ${props => props.theme.fontColor};
  }
  

  
  .airman-row {
    padding: 1rem;
    
    &:hover {
      background: ${props => props.theme.darkest};
    }
  }
  
  &:nth-child(odd) {
    background: ${props => props.theme.dark};
  }
  
  &:nth-child(even) {
    background: ${props => props.theme.light};
  }
`;

export const StyledSiteManager = styled(SiteManager)`
    width: 800px;
    margin-left: auto;
    margin-right: auto;
    
    h2 {
      font-size: 1.5rem;
      font-weight: 300;
      padding-top: 0.5rem;
    }
    
    .airmen-table {
      margin-top: 2rem;
      border: 1px solid ${props => props.theme.graySteel};
    }
    
    .airmen-header {
      background-color: ${props => props.theme.lightest};
      padding: 1rem;
    }
`;
