import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { eventStub, inputValueForDatePicker, selectValueFromDropdown } from '../utils/testUtils';
import { SkillsForm } from './SkillsForm';
import QualificationModel from './models/QualificationModel';
import AirmanQualificationModel from '../airman/models/AirmanQualificationModel';
import * as moment from 'moment';
import DatePicker from '../widgets/DatePicker';
import CertificationModel from './models/CertificationModel';
import QualificationModelFactory from './factories/QualificationModelFactory';
import CertificationModelFactory from './factories/CertificationModelFactory';
import AirmanCertificationModel from '../airman/models/AirmanCertificationModel';
import AirmanQualificationModelFactory from '../airman/factories/AirmanQualificationModelFactory';
import { SkillType } from './models/SkillType';
import Mock = jest.Mock;

describe('SkillsForm', () => {
    const earnDate = moment.utc('2018-02-01');
    const expirationDate = moment.utc('2019-02-01');

    let quals: QualificationModel[];
    let certs: CertificationModel[];
    let handleSubmitSpy: Mock;
    let handleDeleteSpy: Mock;
    let subject: ReactWrapper;

    beforeEach(() => {
        handleSubmitSpy = jest.fn();
        handleDeleteSpy = jest.fn();
        quals = QualificationModelFactory.buildList(3);

        certs = CertificationModelFactory.buildList(3);
        subject = mount(
            <SkillsForm
                airmanId={1}
                qualifications={quals}
                certifications={certs}
                skill={null}
                handleSubmit={handleSubmitSpy}
                handleDelete={handleDeleteSpy}
            />
        );
    });

    it('calls handleSubmit with a Qualification on submission', () => {
        selectValueFromDropdown(subject, 'skillType', SkillType.Qualification);
        selectValueFromDropdown(subject, 'skillNameId', '1');
        inputValueForDatePicker(subject.find(DatePicker).at(0), 'earnDate', earnDate);
        inputValueForDatePicker(subject.find(DatePicker).at(1), 'expirationDate', expirationDate);
        subject.find('form').simulate('submit', eventStub);

        expect(handleSubmitSpy).toHaveBeenCalledWith(
            new AirmanQualificationModel(
                1,
                quals[1],
                earnDate,
                expirationDate
            ));
    });

    it('calls handleSubmit with a Certification on submission', () => {
        selectValueFromDropdown(subject, 'skillType', SkillType.Certification);
        selectValueFromDropdown(subject, 'skillNameId', '1');
        inputValueForDatePicker(subject.find(DatePicker).at(0), 'earnDate', earnDate);
        inputValueForDatePicker(subject.find(DatePicker).at(1), 'expirationDate', expirationDate);
        subject.find('form').simulate('submit', eventStub);

        expect(handleSubmitSpy).toHaveBeenCalledWith(
            new AirmanCertificationModel(
                1,
                certs[1],
                earnDate,
                expirationDate
            ));
    });

    describe('rendering with an existing skill', () => {
        const skill = AirmanQualificationModelFactory.build(1);

        beforeEach(() => {
            subject = mount(
                <SkillsForm
                    airmanId={1}
                    qualifications={quals}
                    certifications={certs}
                    skill={skill}
                    handleSubmit={handleSubmitSpy}
                    handleDelete={handleDeleteSpy}
                />
            );
        });

        it('should only allow the edit of the expiration date', () => {
            subject.find('select').forEach((elem) => {
                expect(elem.prop('disabled')).toBeTruthy();
            });

            expect(subject.find(DatePicker).at(0).prop('disabled')).toBeTruthy();
            expect(subject.find(DatePicker).at(1).prop('disabled')).toBeFalsy();

            subject.find('form').simulate('submit', eventStub);

            expect(handleSubmitSpy).toHaveBeenCalled();
            expect(handleSubmitSpy.mock.calls[0][0].id).toBeDefined();
            expect(handleSubmitSpy.mock.calls[0][0].id).toBe(skill.id);
        });

        it('calls handleDelete when clicking the delete button', () => {
            subject.find('button').simulate('click');
            expect(handleDeleteSpy).toHaveBeenCalledWith(skill);
        });
    });
});