import * as React from 'react';
import styled from 'styled-components';
import {SiteManagerStore} from './stores/SiteManagerStore';
import {inject, observer} from 'mobx-react';
import {CellMeasurerCache} from 'react-virtualized';
import {Link} from 'react-router-dom';
import {OperatorIcon} from '../icons/OperatorIcon';

interface Props {
	siteManagerStore?: SiteManagerStore;
	className?: string;
}

const cache = new CellMeasurerCache({
	defaultHeight: 60,
	fixedWidth: true
});

@observer
export class SiteManager extends React.Component<Props> {
	render() {
		const {siteManagerStore} = this.props;
		const squadron = this.props.siteManagerStore!.squadron;
		cache.clearAll();
		return (
			<div className={this.props.className}>
				<div className="header">
					<h2>{siteManagerStore!.siteName} Personnel</h2>
					<Link to="/flights/new">
						<OperatorIcon/>
						<span>New Operator</span>
					</Link>
				</div>
				{squadron &&
				squadron.flights.map(flight => {
					return (
						<div className="airmen-table" key={flight.id}>
							<h3>{flight.name}</h3>
							<div className="airmen-header">
								<span>NAME</span>
							</div>
							{flight.airmen.map((airman) => {
								return (
									<div className="airman-row" key={airman.id}>
										<span className="airman-name">
											<Link to={`/flights/${airman.id}`}>
												{airman.lastName}, {airman.firstName}
											</Link>
										</span>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}
}

export const StyledSiteManager = inject('siteManagerStore')(styled(SiteManager)`
    width: 800px;
    margin-left: auto;
    margin-right: auto;
    
    h2 {
      font-size: 1.5rem;
      font-weight: 300;
      padding-top: 0.5rem;
    }
    
    h3 {
      padding: 1rem;
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0;
      background: ${props => props.theme.blueSteel};
    }
    
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      a {
        width: 15%;
        display: flex;
        justify-content: space-between;
      }
    }
    
    a {
      text-decoration: none;
      color: ${props => props.theme.fontColor};
    }
    
    .airmen-table {
      border: 1px solid ${props => props.theme.graySteel};
      margin-bottom: 2rem;
      
       .airman-row {
          padding: 1rem;
          cursor: pointer;
      
          &:hover {
            background: ${props => props.theme.darkest};
          }
          
          &:nth-child(odd) {
            background: ${props => props.theme.dark};
          }
    
          &:nth-child(even) {
            background: ${props => props.theme.light};
          }
       }
    }
    
    .airmen-header {
      background-color: ${props => props.theme.lightest};
      padding: 1rem;
    }
`);
