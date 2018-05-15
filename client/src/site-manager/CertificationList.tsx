import * as React from 'react';
import styled from 'styled-components';
import { CertificationModel } from '../skills/models/CertificationModel';

interface Props {
  certifications: CertificationModel[];
  className?: string;
}

export const CertificationList = (props: Props) => {
  return (
    <div className={props.className}>
      <div className="certification-header">CERTIFICATIONS</div>
      <div className="certification-spacer"/>
      {
        props.certifications.map((certification: CertificationModel, index: number) => {
          return (
            <div className="certification-row" key={index}>{certification.title}</div>
          );
        })
      }
    </div>
  );
};

export const StyledCertificationList = styled(CertificationList)`
  border: 1px solid ${props => props.theme.graySteel};
  margin-bottom: 2rem;
  
  .certification-header {
    padding: 1rem;
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
    background: ${props => props.theme.blueSteel};
  }
  
  .certification-spacer {
    background-color: ${props => props.theme.lightest};
    padding: 1rem;
  }
  
  .certification-row {
    padding: 1rem;
    display: flex;
    flex-direction: row;
    
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
`;
