import * as React from 'react';
import styled from 'styled-components';
import { Skill } from './models/Skill';
import { AirmanQualificationModel } from '../airman/models/AirmanQualificationModel';
import { AirmanCertificationModel } from '../airman/models/AirmanCertificationModel';
import { SkillType } from './models/SkillType';
import * as moment from 'moment';
import { Moment } from 'moment';
import { StyledExpirationSleeve } from '../widgets/ExpirationSleeve';

interface Props {
  skill: AirmanQualificationModel | AirmanCertificationModel;
  onClick: (skill: Skill) => void;
  className?: string;
}

const convertToSkill = (skill: AirmanQualificationModel | AirmanCertificationModel): Skill => {
  if (skill instanceof AirmanQualificationModel) {
    return {
      id: skill.id,
      type: SkillType.Qualification,
      airmanId: skill.airmanId,
      skillId: skill.qualification.id,
      earnDate: skill.earnDate,
      expirationDate: skill.expirationDate
    };
  } else {
    return {
      id: skill.id,
      type: SkillType.Certification,
      airmanId: skill.airmanId,
      skillId: skill.certification.id,
      earnDate: skill.earnDate,
      expirationDate: skill.expirationDate
    };
  }
};

export const timeToExpire = (expirationDate: Moment) => {
  return expirationDate.diff(moment(), 'days') > 0 ?
    `Expires ${moment().to(expirationDate)}` :
    `Expired ${moment().to(expirationDate)}`;
};

export const SkillTile = (props: Props) => {
  const {skill} = props;
  return (
    <div
      className={props.className}
      onClick={() => props.onClick(convertToSkill(skill))}
    >
      <div className="currency-title">
        <span>{skill.title}</span>
        {skill.isExpired && <StyledExpirationSleeve/>}
      </div>
      <div className="currency-description">{timeToExpire(skill.expirationDate)}.</div>
    </div>
  );
};

export const StyledSkillTile = styled(SkillTile)`
  background: ${props => props.theme.blueSteel};
  border-radius: 0.25rem 0.25rem 0 0;
  margin: 0.5rem 0;
  padding: 1px;
  
  .currency-title {
    height: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    & > span {
      white-space: nowrap;
      max-width: 240px;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-left: 0.375rem;
    }
    
    &:hover {
      background-color: ${props => props.theme.hoverBlueSteel};
      border-radius: 0.25rem 0.25rem 0 0;
      cursor: pointer;
    }
  }

  .currency-description {
    border-top: solid ${props => props.theme.blueSteel} 1px;
    background: ${props => props.theme.lighter};
    font-size: 0.75rem;
    padding: 0.375rem;
  }
`;