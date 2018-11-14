import React from 'react';
import { shallow } from 'enzyme';

// Components
import App from '../App.js';
import { Header, Board } from '../components/index.js';

describe('App', () => {
	it('renders without crashing', () => {
		shallow(<App />);
	});

	it('renders a div with className "App"', () => {
		const wrapper = shallow(<App />);
		const appDiv = wrapper.find('div.App');

		expect(appDiv.length).toBe(1);
	});

	it('renders a Header and Board component inside appDiv', () => {
		const wrapper = shallow(<App />);
		const appDiv = wrapper.find('div.App');
		const headerComp = appDiv.find(Header);
		const boardComp = appDiv.find(Board);

		expect(wrapper.prop('children').length).toBe(2);
		expect(headerComp.length).toBe(1);
		expect(boardComp.length).toBe(1);
	});
}); // describe 'App'
