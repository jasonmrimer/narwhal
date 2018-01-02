/* tslint:disable:no-any*/
const globalAny: {} = global;

((globalAny as any).requestAnimationFrame = (cb: () => void) => {
  setTimeout(cb, 0);
});

import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as fetch from 'isomorphic-fetch';

enzyme.configure({adapter: new Adapter()});

(globalAny as any).fetch = (url, args) => {
  return fetch(url, {
    headers: {'Authorization': 'Basic dHl0dXM6cGFzc3dvcmQ='},
    ...args
  });
};
