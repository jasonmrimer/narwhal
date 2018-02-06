import * as React from 'react';
import styled from 'styled-components';
import { Skill } from '../../skills/models/Skill';

interface Props {
  skill: Skill;
  key: number;
  handleClick: (skill: Skill) => void;
  className?: string;
}

export const CurrencyTile = (props: Props) => {
  const {skill} = props;
  return (
    <div
      className={props.className}
      key={props.key}
      onClick={() => props.handleClick(skill)}
    >
      <div className="currency-title">{skill.title}</div>
      <div className="currency-description"> {skill.expirationDate.format('DD MMM YY')}</div>
    </div>
  );
};

export default styled(CurrencyTile)`
  background: ${props => props.theme.blueSteel};
  margin: 0.5rem 0;
  padding: 1px;
  
  .currency-title {
    padding: 0.35rem;
    
    &:hover {
      background-color: ${props => props.theme.hoverBlueSteel};
      cursor: pointer;
    }
  }

  .currency-description {
    background: ${props => props.theme.lighter};
    font-size: 12px;
    padding: 0.35rem;
  }
`;