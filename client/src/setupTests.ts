const globalAny: {} = global;

(globalAny.requestAnimationFrame = (cb: () => void) => {
    setTimeout(cb, 0);
});

import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter() });