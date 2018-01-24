import * as React from 'react';
import AirmanModel from '../../airman/models/AirmanModel';
import styled from 'styled-components';
import { Moment } from 'moment';

interface Props {
  airman: AirmanModel;
  className?: string;
}

const list = (label: string, expiration: Moment, index: number) => {
  return (
    <div key={index}>
      <div className="currency-title">{label}</div>
      <div className="currency-description"> {expiration.format('DD MMM YY')}</div>
    </div>
  );
};

export const Currency = (props: Props) => {
  const {airman} = props;
  return (
    <div className={props.className}>
      {
        airman.qualifications.map((qualification, index) => (
          list(qualification.acronym, qualification.expirationDate, index)))
      }
      {
        airman.certifications.map((certification, index) => (
          list(certification.title, certification.expirationDate, index)))
      }
    </div>
  );
};

export default styled(Currency)`
  width: 100%;
  
  & > div {
    background: ${props => props.theme.blueSteel};
    margin: 0.5rem 0;
    padding: 1px;
  }
  
  .currency-title {
    padding: 0.35rem;
  }
  
  .currency-description {
    background: ${props => props.theme.lighter};
    font-size: 12px;
    padding: 0.35rem;
  }
`;
