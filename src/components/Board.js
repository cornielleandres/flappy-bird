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
			width: 5vw;
			height: 30vh;
			position: absolute;
			top: 0;
		}

		#bird {
			background-color: blue;
			width: 5vw;
			height: 5vw;
			position: absolute;
			left: 50%;
		}

		.bottom-pipe {
			background-color: green;
			width: 5vw;
			height: 30vh;
			position: absolute;
			bottom: 0;
		}
	}

	.modal {
		background-color: rgba(0, 0, 0, 0.8);
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		justify-content: center;
		align-items: center;

		.game-over-box {
			background-color: #F0EAD6;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50vw;
			height: 25vh;
			border-radius: 5px;
			padding: 5px;
			flex-wrap: wrap;
			flex-direction: column;

			* {
				margin: 10px;
			}
		}
	}
`;

const initialPipePosX = 85;

const initialState = {
	posY: 50,
	flapUpInterval: null,
	flapDownInterval: null,
	scrollTopPipeInterval: null,
	pipePosX: initialPipePosX,
	milliseconds: 25,
	startDisplay: 'flex',
	gameOverDisplay: 'none',
};

export default class Board extends Component {
	state = initialState;

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
			this.handleGameOver();
		}
	};

	checkPipeOffScreen = () => {
		if (this.topPipe.getBoundingClientRect().left <= 0) {
			this.setState({ pipePosX: initialPipePosX });
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
		} else this.setState({ posY: this.state.posY + 1 });
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
		if (e.key === 'ArrowUp' && this.state.startDisplay === 'none' && this.state.gameOverDisplay === 'none') {
			clearInterval(this.state.flapDownInterval);
			this.flapDownInterval = null;
			this.flapUp();
		}
	};

	handleKeyUp = e => {
		if (e.key === 'ArrowUp' && this.state.startDisplay === 'none' && this.state.gameOverDisplay === 'none') {
			clearInterval(this.state.flapUpInterval);
			this.flapUpInterval = null;
			this.flapDown();
		}
	};

	handleStart = () => {
		this.setState(initialState, () => this.setState({ startDisplay: 'none' }, () => {
			this.screen.focus();
			this.scrollPipe();
			this.flapDown();
		}));
	};

	handleGameOver = () => {
		this.setState({ gameOverDisplay: 'flex' });
	};

	render() {
		const { posY, pipePosX, startDisplay, gameOverDisplay } = this.state;
		return(
			<StyledBoard>
				<div
					ref = { e => this.screen = e }
					className = 'screen'
					tabIndex = '0'
					onKeyDown = { this.handleKeyDown }
					onKeyUp = { this.handleKeyUp}
				>
					<div ref = { e => this.topPipe = e } className = 'top-pipe' style = {{ left: `${ pipePosX }vw` }} />
					<div ref = { e => this.bird = e } id = 'bird' style = {{ top: `${ posY }%` }} />

					<div ref = { e => this.bottomPipe = e } className = 'bottom-pipe' style = {{ left: `${ pipePosX }vw` }} />
				</div>

				<div className = 'modal' style = {{ display: `${ startDisplay }` }}>
					<button onClick = { this.handleStart }>START</button>
				</div>

				<div className = 'modal' style = {{ display: `${ gameOverDisplay }` }}>
					<div className = 'game-over-box'>
						<h3>Game Over!</h3>

						<button onClick = { this.handleStart }>Restart</button>
					</div>
				</div>
			</StyledBoard>
		);
	}
};
