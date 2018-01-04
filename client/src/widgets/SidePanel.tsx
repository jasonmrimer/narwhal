import * as React from 'react';
import AirmanModel from '../airman/models/AirmanModel';
import styled from 'styled-components';
import CloseIcon from '../icons/CloseIcon';

interface Props {
  airman: AirmanModel;
  closeCallback: () => void;
  className?: string;
}

export const SidePanel = (props: Props) => {
  const {airman, className} = props;

  return (
    <div className={`${className} side-panel`}>
      <div className={'header'}>
        <button onClick={props.closeCallback}>
          <CloseIcon/>
        </button>
        <h2>
          {props.airman.lastName}, {props.airman.firstName}
        </h2>
      </div>
      <span>Currency</span>
      {airman.qualifications.map((qualification, index) => {
        return (
          <div key={index}>
            <span>{qualification.acronym}</span>
            <span>{qualification.expirationDate.format('DD MMM YY')}</span>
          </div>
        );
      })}

      {airman.certifications.map((certification, index) => {
        return (
          <div key={index}>
            <span>{certification.title}</span>
            <span>{certification.expirationDate.format('DD MMM YY')}</span>
          </div>
        );
      })}
    </div>
  );
};

export default styled(SidePanel)`
  background-color: ${props => props.theme.lighter};
  width: 25%;
  padding: 1rem;
  position: absolute;
  right: 0;
  height: 100%;
  
  .header{
  justify-content: baseline;
  }
  
  button {
    background-color: ${props => props.theme.lighter};
    border: none;
  }
  
  h2 {
    font-size: 1.2rem;
    border-bottom: 1px solid white;
    padding: 0.75rem;
    font-weight: 400;
  }
  
  div {
    display:flex;
    justify-content: space-between;
  }
  
  span {
    padding: 0.5rem;
    display: inline-block;
  }
`;