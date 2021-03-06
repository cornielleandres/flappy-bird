import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { TweenLite, TimelineLite, Back, TweenMax } from 'gsap';

// Components
import { Top10, HighScore } from './index.js';

// Images and Sounds
import { bg, bird, ding, gameOverSound } from '../assets/index.js';

const StyledBoard = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	flex-direction: column;

	.screen {
		background-image: url('${ bg }');
		background-size: cover;
		border: 1px solid black;
		border-radius: 5px;
		width: 1000px;
		height: 500px;
		position: relative;

		.pipe {
			background-color: green;
			width: 35px;
			position: absolute;
			display: flex;

			.pipe-head {
				background-color: green;
				height: 10px;
				width: 45px;
				position: absolute;
				left: -5px;
			}
		}

		.top-pipe {
			top: 0;
			align-items: flex-end;
		}

		#bird {
			background-image: url('${ bird }');
			background-size: 150% 150%;
			background-position: 50% 75%;
			width: 50px;
			height: 50px;
			position: relative;
			left: 20%;
		}

		.bottom-pipe {
			bottom: 0;
		}
	}

	.modal {
		background-color: rgba(0, 0, 0, 0.6);
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100%;
		justify-content: center;
		align-items: center;

		button {
			border-radius: 10px;
			padding: 5px 10px;
			font-family: 'Indie Flower', cursive;
			font-size: 1.6rem;
			font-weight: bold;

			&:hover {
				background-color: rgba(240, 234, 214, 0.4);
				cursor: pointer;
			}
		}

		.box {
			background-color: rgba(0, 0, 0, 0.8);
			color: white;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			flex-direction: column;
			width: 50%;
			border-radius: 5px;
			padding: 5px;
			font-family: 'Indie Flower', cursive;

			* {
				margin: 8px;
			}

			h3 {
				font-size: 3rem;

				* {
					display: inline-block;
					margin: 0;
				}
			}

			p {
				font-size: 2rem;
				font-weight: bold;
				text-align: center;

				.points {
					font-weight: bold;
					color: lime;
				}
			}
		}
	}
`;

const initialPipePosX = 100;
const initialPipeLength = 150;
const initialIntervalTime = 25;

const initialState = {
	birdPosY: 50,
	cursor: 'default',
	flapUpInterval: null,
	flapDownInterval: null,
	scrollTopPipeInterval: null,
	pipePosX: initialPipePosX,
	intervalTime: initialIntervalTime,
	points: 0,
	startDisplay: 'flex',
	gameOverDisplay: 'none',
	topPipeLength: initialPipeLength,
	bottomPipeLength: initialPipeLength,
	top10: [],
	loadingMsg: '',
	showTop10Btn: false,
};

export default class Board extends Component {
	state = initialState;

	screen = null;
	dingSound = null;
	gameOverSound = null;

	startModal = null;
	gameOverModal = null;
	restartBtn = null;

	topPipe = null;
	bird = null;
	bottomPipe = null;

	flapUpInterval = null;
	flapDownInterval = null;

	scrollPipeInterval = null;
	pipePassedPoints = 1;

	backendUrl = process.env.REACT_APP_BACKEND_URL;

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

		if (topPipeLeft > birdRight || topPipeRight < birdLeft) return;

		if ((birdTop <= topPipeBottom && ((birdLeft >= topPipeLeft && birdLeft <= topPipeRight) || (birdLeft <= topPipeLeft && birdRight >= topPipeLeft))) || (birdBottom >= bottomPipeTop && ((birdLeft >= bottomPipeLeft && birdLeft <= bottomPipeRight) || (birdLeft <= bottomPipeLeft && birdRight >= bottomPipeLeft)))) {
			this.clearAllIntervals();
			return this.handleGameOver();
		}

		if(topPipeRight <= birdLeft && this.pipePassedPoints !== 0) {
			this.dingSound.pause();
			this.setState({ points: this.state.points + this.pipePassedPoints }, () => {
				this.dingSound.play();
				this.pipePassedPoints = 0;
				TweenLite.fromTo(this.screen, 1, { opacity: 0.2 }, { opacity: 1 });
			});
		}
	}; // checkCollision()

	getRandomIntInclusive = (min, max) => {
		//The maximum is inclusive and the minimum is inclusive 
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	checkPipeOffScreen = () => {
		if (this.state.pipePosX <= 3) {
			let newTopPipeLength = 0;
			let newBottomPipeLength = 0;
			if (this.getRandomIntInclusive(0, 1)) {
				newTopPipeLength = this.getRandomIntInclusive(0, initialPipeLength);
				newBottomPipeLength = (2 * initialPipeLength) - newTopPipeLength;
			} else {
				newBottomPipeLength = this.getRandomIntInclusive(0, initialPipeLength);
				newTopPipeLength = (2 * initialPipeLength) - newBottomPipeLength;
			}
			clearInterval(this.state.scrollPipeInterval);
			this.scrollPipeInterval = null;
			this.pipePassedPoints = 1;
			this.setState({
				pipePosX: initialPipePosX,
				topPipeLength: newTopPipeLength,
				bottomPipeLength: newBottomPipeLength,
				intervalTime: this.state.intervalTime !== 10 ? this.state.intervalTime - 1 : 10,
			}, () => this.scrollPipe());
		}
	}; // checkPipeOffScreen()

	scrollPipeTimer = () => {
		this.setState({ pipePosX: this.state.pipePosX - 1 }, () => {
			this.checkPipeOffScreen();
			this.checkCollision();
		});
	};

	scrollPipe = () => {
		this.scrollPipeInterval = () => setInterval(this.scrollPipeTimer, this.state.intervalTime);
		this.setState({ scrollPipeInterval: this.scrollPipeInterval() });
	};

	flapUpTimer = () => {
		if (this.state.birdPosY <= 1) { // if its on the ceiling
			clearInterval(this.state.flapUpInterval);
			this.flapUpInterval = null;
		} else this.setState({ birdPosY: this.state.birdPosY - 1 });
	};

	flapDownTimer = () => {
		if (this.state.birdPosY >= 90) { // if its on the floor
			clearInterval(this.state.flapDownInterval);
			this.flapDownInterval = null;
		} else this.setState({ birdPosY: this.state.birdPosY + 1 });
	};

	flapUp = () => {
		if (this.flapUpInterval === null) {
			this.flapUpInterval = () => setInterval(this.flapUpTimer, this.state.intervalTime);
			this.setState({ flapUpInterval: this.flapUpInterval() });
		}
	};

	flapDown = () => {
		if (this.flapDownInterval === null) {
			this.flapDownInterval = () => setInterval(this.flapDownTimer, this.state.intervalTime);
			this.setState({ flapDownInterval: this.flapDownInterval() });
		}
	};

	handleKeyDown = e => {
		if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && this.state.startDisplay === 'none' && this.state.gameOverDisplay === 'none') {
			clearInterval(this.state.flapDownInterval);
			this.flapDownInterval = null;
			this.flapUp();
		}
	};

	handleKeyUp = e => {
		if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && this.state.startDisplay === 'none' && this.state.gameOverDisplay === 'none') {
			clearInterval(this.state.flapUpInterval);
			this.flapUpInterval = null;
			this.flapDown();
		}
	};

	handleClickModal = e => (e.key === ' ' || e.key === 'Enter') && this.handleStart();

	handleStart = () => {
		this.setState(initialState, () => this.setState({
			startDisplay: 'none',
			cursor: 'none',
		}, () => {
			this.screen.focus();
			this.scrollPipe();
			this.flapDown();
		}));
	};

	focusRestartBtn = () => this.restartBtn.focus();

	showTop10 = () => this.setState({ showTop10Btn: true }, () => {
		TweenLite.fromTo('#view-top10-btn', 0.5, { y: -1500 }, { y: 0, ease: Back.easeOut.config(1.7) });
	});

	handleGameOver = () => this.setState({
		gameOverDisplay: 'flex',
		cursor: 'default',
	}, () => {
		this.gameOverModal.focus();
		this.gameOverSound.play();

		const gameOverTimeline = new TimelineLite({});
		const elemArray = [
			'#game-over-letters1',
			'#game-over-letters2',
			'#game-over-letters3',
			'#game-over-letters4',
			'#game-over-letters5',
			'#game-over-letters6',
			'#game-over-letters7',
			'#game-over-letters8',
			'#game-over-letters9',
			'#points-p',
			this.restartBtn,
		];
		gameOverTimeline
			.staggerFromTo(elemArray, 0.5, { y: -1500 }, { y: 0, ease: Back.easeOut.config(1.7) }, 0.05);
	}); // handleGameOver()

	getTopTen = () => {
		return this.setState({ loadingMsg: 'Getting Top 10. Please wait...'}, () => {
			TweenMax.fromTo('.loading-msg', 1, { opacity: 0 }, { opacity: 1 }).repeat(-1).repeatDelay(1);
			return axios
				.get(`${ this.backendUrl }/top10`)
				.then(data => this.setState({ top10: data.data, loadingMsg: '' }))
				.catch(e => console.log(e));
		});
	};

	exitTop10 = () => this.setState({ top10: [] });

	componentDidMount() {
		this.startModal.focus();
		this.dingSound = new Audio(ding);
		this.gameOverSound = new Audio(gameOverSound);
	};

	render() {
		const {
			birdPosY,
			cursor,
			pipePosX,
			topPipeLength,
			bottomPipeLength,
			points,
			startDisplay,
			gameOverDisplay,
			top10,
			loadingMsg,
			showTop10Btn,
		} = this.state;
		return(
			<StyledBoard>
				<div
					ref = { e => this.screen = e }
					className = 'screen'
					tabIndex = '0'
					onKeyDown = { this.handleKeyDown }
					onKeyUp = { this.handleKeyUp}
					style = {{ cursor: `${ cursor }` }}
				>
					<div ref = { e => this.topPipe = e } className = 'pipe top-pipe' style = {{ left: `calc(${ pipePosX }% - 35px)`, height: `${ topPipeLength }px` }}><div className = 'pipe-head'></div></div>

					<div ref = { e => this.bird = e } id = 'bird' style = {{ top: `${ birdPosY }%` }} />

					<div ref = { e => this.bottomPipe = e } className = 'pipe bottom-pipe' style = {{ left: `calc(${ pipePosX }% - 35px)`, height: `${ bottomPipeLength }px` }}><div className = 'pipe-head'></div></div>
				</div>

				{
					startDisplay === 'flex' &&
					<div ref = { e => this.startModal = e } tabIndex = '-1' onKeyPress = { this.handleClickModal } className = 'modal' style = {{ display: `${ startDisplay }` }}>
						<div className = 'box'>
							<p className = 'instructions'>Click up arrow or w key to flap.</p>

							<p className = 'instructions'>Press Enter or Space to begin.</p>
						</div>
					</div>
				}

				{
					gameOverDisplay === 'flex' &&
					<div ref = { e => this.gameOverModal = e } tabIndex = '-1' className = 'modal' style = {{ display: `${ gameOverDisplay }` }}>
						<div className = 'box'>
							<h3>
								<span id = 'game-over-letters1'>G</span>
								<span id = 'game-over-letters2'>a</span>
								<span id = 'game-over-letters3'>m</span>
								<span id = 'game-over-letters4'>e&#160;</span>
								<span id = 'game-over-letters5'>O</span>
								<span id = 'game-over-letters6'>v</span>
								<span id = 'game-over-letters7'>e</span>
								<span id = 'game-over-letters8'>r</span>
								<span id = 'game-over-letters9'>!</span>
							</h3>

							<p id = 'points-p'><span className = 'points'>{ points }</span>point{ points !== 1 && 's' }</p>

							<button ref = { e => this.restartBtn = e } onClick = { this.handleStart }>Restart</button>

							<HighScore
								backendUrl = { this.backendUrl }
								points = { points }
								getTopTen = { this.getTopTen }
								focusRestartBtn = { this.focusRestartBtn }
								showTop10 = { this.showTop10 }
							/>

							{ top10.length === 0 && showTop10Btn && <button id = 'view-top10-btn' onClick = { this.getTopTen }>View Top 10</button> }

							{ loadingMsg && <p className = 'loading-msg'>{ loadingMsg }</p> }

							{ top10.length > 0 && <Top10 top10 = { top10 } exitTop10 = { this.exitTop10 } /> }
						</div>
					</div>
				}
			</StyledBoard>
		);
	}
};

// for testing purposes
export { StyledBoard };
