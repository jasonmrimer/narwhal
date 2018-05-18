import * as React from 'react';
import styled from 'styled-components';
import { CertificationModel } from '../skills/certification/models/CertificationModel';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../icons/PlusIcon';

interface Props {
  certifications: CertificationModel[];
  className?: string;
}

export const CertificationList = (props: Props) => {
  return (
    <div className={props.className}>
      <div className="certification-header">
        <span>CERTIFICATIONS</span>
        <Link to="/certifications/new">
          <PlusIcon/> ADD CERTIFICATION
        </Link>
      </div>
      <div className="certification-spacer"/>
      {
        props.certifications.map((certification: CertificationModel, index: number) => {
          return (
            <Link to={`/certifications/${certification.id}`} key={index}>
              <div className="certification-row">{certification.title}</div>
            </Link>
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
    background: ${props => props.theme.blueSteel};
    
    a {
      & > svg {
        margin-right: 0.5rem;
      }
    
      display: flex;
      align-items: center;
      font-weight: 300;
      font-size: 0.75rem;
    }
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
