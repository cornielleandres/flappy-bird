import React from 'react';
import { shallow } from 'enzyme';

// Component
import { Top10, StyledTable } from '../../components/index.js';

describe('<Top10 />', () => {
	it('renders without crashing', () => {
		shallow(<Top10
			top10 = { [{}] }
		/>);
	});

	it('renders a StyledTable component', () => {
		const wrapper = shallow(<Top10
			top10 = { [{}] }
		/>);
		const styledTable = wrapper.find(StyledTable);

		expect(styledTable.length).toBe(1);
	});

	describe('inside StyledTable', () => {
		it('renders its children correctly', () => {
			const wrapper = shallow(<Top10
				top10 = { [{}] }
			/>);
			const styledTable = wrapper.find(StyledTable);
			const theadTag = styledTable.find('thead');
			const tbodyTag = styledTable.find('tbody');

			expect(theadTag.length).toBe(1);
			expect(tbodyTag.length).toBe(1);
		});

		describe('inside thead', () => {
			it('renders its children correctly', () => {
				const wrapper = shallow(<Top10
					top10 = { [{}] }
				/>);
				const styledTable = wrapper.find(StyledTable);
				const theadTag = styledTable.find('thead');
				const trTag = theadTag.find('tr');
				const thTags = trTag.find('th');

				expect(trTag.length).toBe(1);
				expect(thTags.length).toBe(2);
				expect(thTags.at(0).text()).toBe('Name');
				expect(thTags.at(1).text()).toBe('Score');
			});
		}); // describe 'inside thead'

		describe('inside tbody', () => {
			it('renders its children correctly', () => {
				const wrapper = shallow(<Top10
					top10 = { [{}, {}, {}, {}] }
				/>);
				const styledTable = wrapper.find(StyledTable);
				const tbodyTag = styledTable.find('tbody');
				const trTags = tbodyTag.find('tr');
				const tdTags = trTags.find('td');
				const goldMedalImg = tdTags.at(0).find('img#gold-medal');
				const silverMedalImg = tdTags.at(2).find('img#silver-medal');
				const bronzeMedalImg = tdTags.at(4).find('img#bronze-medal');
				const noImg = tdTags.at(6).find('img');

				expect(trTags.length).toBe(4);
				expect(tdTags.length).toBe(8);
				expect(goldMedalImg.length).toBe(1);
				expect(silverMedalImg.length).toBe(1);
				expect(bronzeMedalImg.length).toBe(1);
				expect(noImg.length).toBe(0);
			});
		}); // describe 'inside tbody'
	}); // describe 'inside StyledTable'
}); // describe '<Top10 />'
