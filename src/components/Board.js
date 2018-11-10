import React, { Component } from 'react';
import styled from 'styled-components';

const StyledBoard = styled.div`
	.screen {
		background-color: #aaa;
		border: 1px solid black;
		border-radius: 5px;
		width: 90vw;
		height: 90vh;
		position: relative;

		.top-pipe {
			background-color: green;
			width: 5vh;
			height: 50vh;
			position: absolute;
			top: 0;
		}

		#bird {
			background-color: blue;
			width: 5vh;
			height: 5vh;
			position: absolute;
			left: 50%;
		}
	}
`;

export default class Board extends Component {
	state = {
		posY: 75,
		flapUpInterval: null,
		flapDownInterval: null,
		scrollTopPipeInterval: null,
		topPipePosX: 50,
		milliseconds: 25,
	};

	topPipe = null;
	bird = null;

	flapUpInterval = null;
	flapDownInterval = null;

	scrollTopPipeInterval = null;

	clearAllIntervals = () => {
		this.handleKeyDown = null;
		this.handleKeyUp = null;
		clearInterval(this.state.flapDownInterval);
		this.flapDownInterval = null;
		clearInterval(this.state.flapUpInterval);
		this.flapUpInterval = null;
	};

	checkCollision = () => {
		const {
			top: birdTop,
			left: birdLeft,
			right: birdRight,
		} = this.bird.getBoundingClientRect();

		const {
			bottom: topPipeBottom,
			left: topPipeLeft,
			right: topPipeRight,
		} = this.topPipe.getBoundingClientRect();

		if (birdTop <= topPipeBottom && ((birdLeft >= topPipeLeft && birdLeft <= topPipeRight) || (birdLeft <= topPipeLeft && birdRight >= topPipeLeft))) {
			this.clearAllIntervals();
			console.log('HIT!');
		}
	};

	checkTopPipeOffScreen = () => {
		if (this.topPipe.getBoundingClientRect().left <= 0) {
			clearInterval(this.state.scrollTopPipeInterval);
		}
	};

	scrollTopPipeTimer = () => {
		this.setState({ topPipePosX: this.state.topPipePosX - 1 }, () => this.checkTopPipeOffScreen());
	}

	scrollTopPipe = () => {
		this.scrollTopPipeInterval = () => setInterval(this.scrollTopPipeTimer, this.state.milliseconds);
		this.setState({ scrollTopPipeInterval: this.scrollTopPipeInterval() });
	};

	flapUpTimer = () => this.setState({ posY: this.state.posY - 1 }, () => this.checkCollision());
	flapDownTimer = () => {
		if (this.state.posY === 75) {
			clearInterval(this.state.flapDownInterval);
			this.flapDownInterval = null;
		} else this.setState({ posY: this.state.posY + 1 });
	}

	flapUp = () => {
		if (this.flapUpInterval === null) {
			this.flapUpInterval = () => setInterval(this.flapUpTimer, this.state.milliseconds);
			this.setState({ flapUpInterval: this.flapUpInterval() });
		}
	};

	flapDown = () => {
		if (this.flapDownInterval === null) {
			this.flapDownInterval = () => setInterval(this.flapDownTimer, this.state.milliseconds);
			this.setState({ flapDownInterval: this.flapDownInterval() });
		}
	};

	handleKeyDown = e => {
		if (e.key === 'ArrowUp') {
			clearInterval(this.state.flapDownInterval);
			this.flapDownInterval = null;
			this.flapUp();
		}
	};

	handleKeyUp = e => {
		if (e.key === 'ArrowUp') {
			setTimeout(() => {
				clearInterval(this.state.flapUpInterval);
				this.flapUpInterval = null;
				setTimeout(() => {
					this.flapDown();
				}, 25); // how much to wait before going back down
			}, 75); // how much farther up it goes without stopping
		}
	};

	componentDidMount() {
		this.scrollTopPipe();
	};

	render() {
		const { posY, topPipePosX } = this.state;
		return(
			<StyledBoard>
				<div
					className = 'screen'
					tabIndex = '0'
					onKeyDown = { this.handleKeyDown }
					onKeyUp = { this.handleKeyUp}
				>
					<div ref = { e => this.topPipe = e } className = 'top-pipe' style={{ left: `${ topPipePosX }%` }} />
					<div ref = { e => this.bird = e } id = 'bird' style={{ top: `${ posY }%` }} />
				</div>
			</StyledBoard>
		);
	}
};
