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
      <span>{label}</span>
      <span>{expiration.format('DD MMM YY')}</span>
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
  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;  
  }
`;
