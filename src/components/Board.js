import React, { Component } from 'react';
import styled from 'styled-components';

const StyledBoard = styled.div`
	display: flex;
	justify-content: center;
	align-items; center;

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
			height: 30vh;
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

		.bottom-pipe {
			background-color: green;
			width: 5vh;
			height: 30vh;
			position: absolute;
			bottom: 0;
		}
	}

	.start-modal {
		background-color: rgba(0, 0, 0, 0.8);
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		justify-content: center;
		align-items: center;
	}
`;

export default class Board extends Component {
	state = {
		posY: 50,
		flapUpInterval: null,
		flapDownInterval: null,
		scrollTopPipeInterval: null,
		pipePosX: 100,
		milliseconds: 25,
		startDisplay: 'flex',
	};

	screen = null;

	topPipe = null;
	bird = null;
	bottomPipe = null;

	flapUpInterval = null;
	flapDownInterval = null;

	scrollPipeInterval = null;

	clearAllIntervals = () => {
		const intervals = [
			this.state.flapDownInterval,
			this.state.flapUpInterval,
			this.state.scrollPipeInterval,
		];
		intervals.forEach(clearInterval);
		this.handleKeyDown = null;
		this.handleKeyUp = null;
		this.flapDownInterval = null;
		this.flapUpInterval = null;
		this.scrollPipeInterval = null;
	};

	checkCollision = () => {
		const {
			bottom: topPipeBottom,
			left: topPipeLeft,
			right: topPipeRight,
		} = this.topPipe.getBoundingClientRect();

		const {
			top: birdTop,
			bottom: birdBottom,
			left: birdLeft,
			right: birdRight,
		} = this.bird.getBoundingClientRect();

		const {
			top: bottomPipeTop,
			left: bottomPipeLeft,
			right: bottomPipeRight,
		} = this.bottomPipe.getBoundingClientRect();

		if ((birdTop <= topPipeBottom && ((birdLeft >= topPipeLeft && birdLeft <= topPipeRight) || (birdLeft <= topPipeLeft && birdRight >= topPipeLeft))) || (birdBottom >= bottomPipeTop && ((birdLeft >= bottomPipeLeft && birdLeft <= bottomPipeRight) || (birdLeft <= bottomPipeLeft && birdRight >= bottomPipeLeft)))) {
			this.clearAllIntervals();
		}
	};

	checkPipeOffScreen = () => {
		if (this.topPipe.getBoundingClientRect().left <= 0) {
			this.setState({ pipePosX: 100 });
		}
	};

	scrollPipeTimer = () => {
		this.setState({ pipePosX: this.state.pipePosX - 1 }, () => {
			this.checkPipeOffScreen()
			this.checkCollision()
		});
	};

	scrollPipe = () => {
		this.scrollPipeInterval = () => setInterval(this.scrollPipeTimer, this.state.milliseconds);
		this.setState({ scrollPipeInterval: this.scrollPipeInterval() });
	};

	flapUpTimer = () => this.setState({ posY: this.state.posY - 1 });
	flapDownTimer = () => {
		if (this.state.posY === 75) { // if its on the floor
			clearInterval(this.state.flapDownInterval);
			this.flapDownInterval = null;
		} else this.setState({ posY: this.state.posY + 0.5 });
	};

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

	handleStart = () => {
		this.setState({ startDisplay: 'none' }, () => {
			this.screen.focus();
			this.scrollPipe();
			this.flapDown();
		});
	};

	render() {
		const { posY, pipePosX, startDisplay } = this.state;
		return(
			<StyledBoard>
				<div
					ref = { e => this.screen = e }
					className = 'screen'
					tabIndex = '0'
					onKeyDown = { this.handleKeyDown }
					onKeyUp = { this.handleKeyUp}
				>
					<div ref = { e => this.topPipe = e } className = 'top-pipe' style = {{ left: `${ pipePosX }%` }} />
					<div ref = { e => this.bird = e } id = 'bird' style = {{ top: `${ posY }%` }} />

					<div ref = { e => this.bottomPipe = e } className = 'bottom-pipe' style = {{ left: `${ pipePosX }%` }} />
				</div>

				<div className = 'start-modal' style = {{ display: `${ startDisplay }` }}>
					<button onClick = { this.handleStart }>START</button>
				</div>
			</StyledBoard>
		);
	}
};
