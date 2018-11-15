import React from 'react';
import { mount } from 'enzyme';

// Component
import { Board, StyledBoard, HighScore, Top10 } from '../../components/index.js';

describe('<Board />', () => {
	it('renders without crashing', () => {
		mount(<Board />);
	});

	it('renders a StyledBoard component', () => {
		const wrapper = mount(<Board />);
		const styledBoard = wrapper.find(StyledBoard);

		expect(styledBoard.length).toBe(1);
	});

	describe('Board state', () => {
		it('should have 15 properies', () => {
			const wrapper = mount(<Board />);
			const instance = wrapper.instance();

			expect(Object.keys(instance.state).length).toBe(15);
		});

		it('should have certain default values for its properties', () => {
			const wrapper = mount(<Board />);
			const instance = wrapper.instance();

			expect(instance.state.birdPosY).toBe(50);
			expect(instance.state.cursor).toBe('default');
			expect(instance.state.flapUpInterval).toBe(null);
			expect(instance.state.flapDownInterval).toBe(null);
			expect(instance.state.scrollTopPipeInterval).toBe(null);
			expect(instance.state.pipePosX).toBe(100);
			expect(instance.state.intervalTime).toBe(25);
			expect(instance.state.points).toBe(0);
			expect(instance.state.startDisplay).toBe('flex');
			expect(instance.state.gameOverDisplay).toBe('none');
			expect(instance.state.topPipeLength).toBe(150);
			expect(instance.state.bottomPipeLength).toBe(150);
			expect(instance.state.top10).toEqual([]);
			expect(instance.state.loadingMsg).toBe('');
			expect(instance.state.showTop10Btn).toBe(false);
		});
	}); // describe 'Board state'

	describe('inside StyledBoard', () => {
		it('renders a div with className "screen"', () => {
			const wrapper = mount(<Board />);
			const styledBoard = wrapper.find(StyledBoard);
			const screen = styledBoard.find('div.screen');

			expect(screen.length).toBe(1);
		});

		it('renders the startDisplay div when state.startDisplay is "flex"', () => {
			// state.startDisplay defaults to 'flex'
			const wrapper = mount(<Board />);
			const styledBoard = wrapper.find(StyledBoard);
			const modal = styledBoard.find('div.modal');
			const box = modal.find('div.box');
			const instructions = box.find('p.instructions');

			expect(modal.length).toBe(1);
			expect(box.length).toBe(1);
			expect(instructions.length).toBe(2);
		});

		it('renders the gameOverDisplay div when state.gameOverDisplay is "flex"', () => {
			const wrapper = mount(<Board />);
			wrapper.setState({ startDisplay: 'none', gameOverDisplay: 'flex' });
			const styledBoard = wrapper.find(StyledBoard);
			const modal = styledBoard.find('div.modal');

			expect(modal.length).toBe(1);
		});

		describe('inside div.gameOverDisplay', () => {
			it('renders its sub components correctly', () => {
				const wrapper = mount(<Board />);
				wrapper.setState({ startDisplay: 'none', gameOverDisplay: 'flex' });
				const styledBoard = wrapper.find(StyledBoard);
				const modal = styledBoard.find('div.modal');
				const box = modal.find('div.box');
				const h3 = box.find('h3');
				const spans = h3.find('span');
				const pointsP = box.find('p#points-p');
				const pointsSpan = pointsP.find('span.points');
				const restartBtn = box.find('button');
				const highScore = box.find(HighScore);

				expect(box.length).toBe(1);
				expect(h3.length).toBe(1);
				expect(spans.length).toBe(9);
				expect(pointsP.length).toBe(1);
				expect(pointsSpan.length).toBe(1);
				expect(restartBtn.length).toBe(1);
				expect(restartBtn.text()).toBe('Restart');
				expect(highScore.length).toBe(1);
			});

			it('renders viewTop10Btn correctly', () => {
				const wrapper = mount(<Board />);
				wrapper.setState({
					startDisplay: 'none',
					gameOverDisplay: 'flex',
					showTop10Btn: true,
				});
				const styledBoard = wrapper.find(StyledBoard);
				const modal = styledBoard.find('div.modal');
				const box = modal.find('div.box');
				const viewTop10Btn = box.find('button#view-top10-btn');

				expect(viewTop10Btn.length).toBe(1);
				expect(viewTop10Btn.text()).toBe('View Top 10');
			});

			it('renders p.loading-msg correctly', () => {
				const wrapper = mount(<Board />);
				wrapper.setState({
					startDisplay: 'none',
					gameOverDisplay: 'flex',
					loadingMsg: 'Test loading message.'
				});
				const styledBoard = wrapper.find(StyledBoard);
				const modal = styledBoard.find('div.modal');
				const box = modal.find('div.box');
				const loadingMsgP = box.find('p.loading-msg');

				expect(loadingMsgP.length).toBe(1);
				expect(loadingMsgP.text()).toBe('Test loading message.');
			});

			it('renders Top10 component correctly', () => {
				const wrapper = mount(<Board />);
				wrapper.setState({
					startDisplay: 'none',
					gameOverDisplay: 'flex',
					top10: [ {} ],
				});
				const styledBoard = wrapper.find(StyledBoard);
				const modal = styledBoard.find('div.modal');
				const box = modal.find('div.box');
				const top10Comp = box.find(Top10);

				expect(top10Comp.length).toBe(1);
			});
		}); // describe 'inside div.gameOverDisplay'

		describe('inside screen div', () => {
			it('renders 3 divs', () => {
				const wrapper = mount(<Board />);
				const styledBoard = wrapper.find(StyledBoard);
				const screen = styledBoard.find('div.screen');
				const topPipe = screen.find('div.top-pipe');
				const bird = screen.find('div#bird');
				const bottomPipe = screen.find('div.bottom-pipe');

				expect(screen.children().length).toBe(3);
				expect(topPipe.length).toBe(1);
				expect(bird.length).toBe(1);
				expect(bottomPipe.length).toBe(1);
			});

			it('renders a div with className "pipe-head" inside top and bottom pipes', () => {
				const wrapper = mount(<Board />);
				const styledBoard = wrapper.find(StyledBoard);
				const screen = styledBoard.find('div.screen');
				const topPipe = screen.find('div.top-pipe');
				const bottomPipe = screen.find('div.bottom-pipe');
				const topPipeHead = topPipe.find('div.pipe-head');
				const bottomPipeHead = bottomPipe.find('div.pipe-head');

				expect(topPipe.children().length).toBe(1);
				expect(bottomPipe.children().length).toBe(1);
				expect(topPipeHead.length).toBe(1);
				expect(bottomPipeHead.length).toBe(1);
			});
		}); // describe 'inside screen div'
	}); // describe 'inside StyledBoard'
}); // describe '<Board />'
