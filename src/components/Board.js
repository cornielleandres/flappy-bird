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
		milliseconds: 25,
	};

	flapUpInterval = null;
	flapDownInterval = null;

	flapUpTimer = () => this.setState({ posY: this.state.posY - 1 });
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

	render() {
		const { posY } = this.state;
		return(
			<StyledBoard>
				<div
					className = 'screen'
					tabIndex = '0'
					onKeyDown = { this.handleKeyDown }
					onKeyUp = { this.handleKeyUp}
				>
					Screen
					<div id = 'bird' style={{ top: `${posY}%` }}></div>
				</div>
			</StyledBoard>
		);
	}
};
