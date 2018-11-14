import React from 'react';
import { shallow, mount } from 'enzyme';

// Component
import { Header, StyledHeader } from '../../components/index.js';

describe('<Header />', () => {
	it('renders without crashing', () => {
		shallow(<Header />);
	});

	it('renders a StyledHeader component', () => {
		const wrapper = mount(<Header />);
		const styledHeaderComp = wrapper.find(StyledHeader);

		expect(wrapper.children().length).toBe(1);
		expect(styledHeaderComp.length).toBe(1);
	});

	it('renders an h1 tag inside styledHeaderComp', () => {
		const wrapper = mount(<Header />);
		const styledHeaderComp = wrapper.find(StyledHeader);
		const h1 = styledHeaderComp.find('h1');

		expect(styledHeaderComp.children().length).toBe(1);
		expect(h1.length).toBe(1);
		expect(h1.text()).toBe('Flappy Bird Clone');
	});
}); // describe '<Header />'
