import * as React from 'react';
import styled from 'styled-components';
import { CrewModel } from './models/CrewModel';
import { observer } from 'mobx-react';
import { CrewPositionModel } from './models/CrewPositionModel';
import { AirmanModel } from '../airman/models/AirmanModel';

interface Props {
  crew: CrewModel;
  visible?: boolean;
  className?: string;
}

@observer
export class PrintableMissionPlanner extends React.Component<Props, {}> {
  static emptyRows = 15;

  componentDidMount() {
    const beforePrint = () => {
      document.getElementById('classification-banner')!.style.display = 'none';
    };

    const afterPrint = () => {
      document.getElementById('classification-banner')!.style.display = 'block';
    };

    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener((mql) => {
        if (mql.matches) {
          beforePrint();
        } else {
          afterPrint();
        }
      });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
  }

  renderRows = () => {
    let positions = this.props.crew.crewPositions;
    positions = positions.concat(Array(PrintableMissionPlanner.emptyRows)
      .fill(new CrewPositionModel(AirmanModel.empty())));

    return positions.map((position, index) => {
      return (
        <div key={index} className="crew-row">
          <span className="critical-col underlined">{position.critical ? '*' : ''}</span>
          <span className="position-col underlined">{position.title}</span>
          <span className="member-col underlined">{position.displayFullName}</span>
          <span className="signature-col underlined"/>
          <span className="remarks-col underlined"/>
        </div>
      );
    });
  }

  render() {
    const {crew, className} = this.props;
    return (
      <div id="printable-mission-planner" className={className}>
        <h3 className="mission-name">{crew.mission.atoMissionNumber}</h3>
        <div className="mission-details">
          <span>{`MSN DATE: ${crew.mission.displayDate}`}</span>
          <span>{`MSN START: ${crew.mission.displayStartTime}`}</span>
          <span>{`MSN END: ${crew.mission.displayEndTime}`}</span>
        </div>
        <div className="form-details">
          <span className="location-details">Squadron:</span>
          <span className="location-details">Site:</span>
          <span className="location-details">Commander:</span>
        </div>
        <div className="crew-header">
          <span className="critical-col">CRITICAL</span>
          <span className="position-col">POSITION</span>
          <span className="member-col">CREW MEMBER</span>
          <span className="signature-col">SIGNATURE</span>
          <span className="remarks-col">REMARKS</span>
        </div>
        {this.renderRows()}
        <div className="signatures-block">
          <span style={{width: '60%'}}>
            <span>VERIFIED BY:</span>
            <div>
              <span className="signature-box OT">Operations Training:</span>
              <span className="signature-box SE">Standardization Evaluation:</span>
            </div>
          </span>
          <span style={{width: '30%'}}>
            <span>SIGNED BY:</span>
            <div>
              <span className="signature-box DO">Director of Operations:</span>
            </div>
          </span>
        </div>
      </div>
    );
  }
}

export const StyledPrintableMissionPlanner = styled(PrintableMissionPlanner)`
  display: ${props => props.visible ? 'block' : 'none'};
  z-index: 2000;
  
  background: white;
  color: black;
  
  width: 100%;
  min-height: 100%;
  
  @media print {
    display: block;
    
    .classification-banner {
      display: none;
    }
  }
  
  .mission-details {
    margin-top: 0.16in;
  
    span {
      margin-right: 1rem;
    }
  }
  
  .form-details {
    display: flex;
    justify-content: space-between;
    margin-top: 0.16in;
  }
  
  .location-details {
    font-size: 0.10in;
    border: 1px solid black;
    padding: 0 0.25in 0.25in 0;
    width: ${1 / 3 * 100}%;
    display: inline-block;
    
    &:nth-child(2) {
      border-left: none;
      border-right: none;
    }
  }
  
  .crew-header, .crew-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .crew-header {
    padding: 16px 0 24px 0;
    font-size: 0.08in;
    font-weight: bold;
    
    .position {
      text-align: center;
    }
    
    .member {
      text-align: center;
    }
  }
  
  .crew-row {
    font-size: 0.14in;
    margin-bottom: 0.16in;
    height: 0.16in;
    page-break-before: auto;
    page-break-after: avoid;
    page-break-inside: avoid;
  }
  
  .critical-col {
    width: 4%;
    text-align: center;
  }

  .position-col {
    width: 10%;
  }
  
  .member-col {
    width: 20%;
  }
  
  .signature-col {
    width: 20%;
    text-align: center;
  }
  
  .remarks-col {
    width: 36%;
    text-align: center;
  }
  
  .underlined {
    border-bottom: 1px solid black;
  }
  
  .mission-name {
    font-size: 0.24in;
    margin: 0;
  }
  
  .signatures-block {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 0.32in;
    page-break-after: avoid;
    page-break-before: auto;
    page-break-inside: avoid;
    font-size: 0.12in;
  }
    
  .signature-box {
    font-size: 0.10in;
    border: 1px solid black;
    padding: 0 1in 1in 0;
    display: inline-block;
  }
  
  .OT {
    width: 50%;
    border-right: 1px solid black;
  }
  
  .SE {
    width: 50%;
    border-left: none;
  }
  
  .DO {
    width: 100%;
  }
`;
