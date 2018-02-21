import * as React from 'react';
import styled from 'styled-components';
import { Skill } from './models/Skill';
import { ExpirationAlert } from '../icons/ExpirationAlert';

interface Props {
  skill: Skill;
  handleClick: (skill: Skill) => void;
  className?: string;
}

export const SkillTile = (props: Props) => {
  const {skill} = props;
  return (
    <div
      className={props.className}
      onClick={() => props.handleClick(skill)}
    >
      <div className="currency-title">
        <span>{skill.title}</span>
        {skill.isExpired && <ExpirationAlert />}
      </div>
      <div className="currency-description"> {skill.expirationDate.format('DD MMM YY')}</div>
    </div>
  );
};

export const StyledSkillTile = styled(SkillTile)`
  background: ${props => props.theme.blueSteel};
  margin: 0.5rem 0;
  padding: 1px;
  
  .currency-title {
    padding: 0.35rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
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