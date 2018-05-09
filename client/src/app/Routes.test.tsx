import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Routes } from './Routes';
import { shallow } from 'enzyme';

describe('Routes', () => {
  it('should support all routes', async () => {

    const subject = shallow(<Routes />);

    expect(subject.find(Switch).children().length).toBe(8);
    expect(subject.find(Route).at(0).prop('path')).toBe('/');
    expect(subject.find(Route).at(1).prop('path')).toBe('/upload');
    expect(subject.find(Route).at(2).prop('path')).toBe('/dashboard');
    expect(subject.find(Route).at(3).prop('path')).toBe('/dashboard/crew/:id');
    expect(subject.find(Route).at(4).prop('path')).toBe('/flights');
    expect(subject.find(Route).at(5).prop('path')).toBe('/flights/new');
    expect(subject.find(Route).at(6).prop('path')).toBe('/flights/:airmanId');
    expect(subject.find(Route).at(7).prop('path')).toBe('/admin');
  });
});