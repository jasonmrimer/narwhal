const globalAny: {} = global;

(globalAny.requestAnimationFrame = (cb: () => void) => {
  setTimeout(cb, 0);
});

import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as fetch from 'isomorphic-fetch';

enzyme.configure({adapter: new Adapter()});

globalAny.fetch = (url, args) => {
  return fetch(url, {
    headers: {'Authorization': 'Basic dHl0dXM6cGFzc3dvcmQ='},
    ...args
  });
};
