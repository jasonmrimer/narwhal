import * as React from 'react';
import styled from 'styled-components';
import { ExpirationAlert } from '../icons/ExpirationAlert';
import { Skill } from './models/Skill';
import { AirmanQualificationModel } from '../airman/models/AirmanQualificationModel';
import { AirmanCertificationModel } from '../airman/models/AirmanCertificationModel';
import { SkillType } from './models/SkillType';

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

export const SkillTile = (props: Props) => {
  const {skill} = props;
  return (
    <div
      className={props.className}
      onClick={() => props.onClick(convertToSkill(skill))}
    >
      <div className="currency-title">
        <span>{skill.title}</span>
        {skill.isExpired && <ExpirationAlert/>}
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