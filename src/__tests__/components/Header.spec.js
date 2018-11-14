import React from 'react';
import { shallow } from 'enzyme';

// Component
import { Header } from '../../components/index.js';

describe('<Header />', () => {
	it('renders without crashing', () => {
		shallow(<Header />);
	});

	it('renders an h1 tag', () => {
		const wrapper = shallow(<Header />);
		const h1 = wrapper.find('h1');

		expect(wrapper.children().length).toBe(1);
		expect(h1.length).toBe(1);
		expect(h1.text()).toBe('Flappy Bird Clone');
	});
}); // describe '<Header />'
