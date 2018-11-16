import React from 'react';
import { shallow, mount } from 'enzyme';

// Component
import { HighScore, StyledHighScore } from '../../components/index.js';

describe('<HighScore />', () => {
	it('renders without crashing', () => {
		shallow(<HighScore />);
	});

	it('renders a StyledHighScore component', () => {
		const wrapper = shallow(<HighScore />);
		const styledHighScore = wrapper.find(StyledHighScore);

		expect(styledHighScore.length).toBe(1);
	});

	describe('HighScore state', () => {
		it('should have 4 properies', () => {
			const wrapper = shallow(<HighScore />);
			const instance = wrapper.instance();

			expect(Object.keys(instance.state).length).toBe(4);
		});

		it('should have certain default values for its properties', () => {
			const wrapper = shallow(<HighScore />);
			const instance = wrapper.instance();

			expect(instance.state.highScore).toBe(false);
			expect(instance.state.name).toBe('');
			expect(instance.state.scoreSubmitted).toBe(false);
			expect(instance.state.message).toBe('Checking high scores. Please wait...');
		});
	}); // describe 'HighScore state'

	describe('inside StyledHighScore', () => {
		it('renders p.message when state.highScore === false', () => {
			const wrapper = shallow(<HighScore />);
			const styledHighScore = wrapper.find(StyledHighScore);
			const wrapperDiv = styledHighScore.find('div.wrapper');
			const messageP = wrapperDiv.find('p.message');

			expect(wrapperDiv.length).toBe(1);
			expect(messageP.length).toBe(1);
			expect(messageP.text()).toBe('Checking high scores. Please wait...');
		});

		it('renders the high score submit form when state.highScore === true', () => {
			const wrapper = shallow(<HighScore />);
			wrapper.setState({ highScore: true });
			const styledHighScore = wrapper.find(StyledHighScore);
			const wrapperDiv = styledHighScore.find('div.wrapper');
			const highScoreP = wrapperDiv.find('p.high-score');
			const highScoreForm = wrapperDiv.find('form');

			expect(wrapperDiv.length).toBe(1);
			expect(highScoreP.length).toBe(1);
			expect(highScoreP.text()).toBe('You got a high score!!');
			expect(highScoreForm.length).toBe(1);
		});

		describe('inside the high score form', () => {
			it('renders its children correctly', () => {
				const wrapper = shallow(<HighScore />);
				wrapper.setState({ highScore: true, message: 'Test message.' });
				const styledHighScore = wrapper.find(StyledHighScore);
				const wrapperDiv = styledHighScore.find('div.wrapper');
				const highScoreForm = wrapperDiv.find('form');
				const enterNameP = highScoreForm.find('p.enter-your-name');
				const nameInput = highScoreForm.find('input.name-input');
				const messageP = highScoreForm.find('p.message');
				const submitBtn = highScoreForm.find('button');

				expect(enterNameP.length).toBe(1);
				expect(enterNameP.text()).toBe('Enter your name to save your record in the Top 10:');
				expect(nameInput.length).toBe(1);
				expect(messageP.length).toBe(1);
				expect(messageP.text()).toBe('Test message.');
				expect(submitBtn.length).toBe(1);
				expect(submitBtn.text()).toBe('Submit');
			});
		}); // describe 'inside the high score form'
	}); // describe 'inside StyledHighScore'
}); // describe '<HighScore />'
