import React from 'react';
import { shallow, mount } from 'enzyme';

// Component
import { Header } from '../../components/index.js';

describe('<Header />', () => {
	it('renders without crashing', () => {
		shallow(<Header />);
	});

	it('renders a styledHeader component', () => {
		const wrapper = mount(<Header />);
		const styledHeader = wrapper.find('header.sc-bwzfXH');

		expect(wrapper.children().length).toBe(1);
		expect(styledHeader.length).toBe(1);
	});

	it('renders an h1 tag inside StyledHeader', () => {
		const wrapper = mount(<Header />);
		const styledHeader = wrapper.find('header.sc-bwzfXH');
		const h1 = styledHeader.find('h1');

		expect(styledHeader.children().length).toBe(1);
		expect(h1.length).toBe(1);
		expect(h1.text()).toBe('Flappy Bird Clone');
	});
}); // describe '<Header />'
