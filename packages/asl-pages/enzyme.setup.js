import Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
console.log('Running enzyme setup...');
Enzyme.configure({ adapter: new Adapter() });
