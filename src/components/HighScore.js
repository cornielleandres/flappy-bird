import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StyledHighScore = styled.div`
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		flex-direction: column;

		.message {
			font-size: 1.2rem;
		}

		* {
			margin: 8px;
		}

		form {
			border: 1px solid white;
			border-radius: 10px;
			padding: 10px;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			flex-direction: column;

			.enter-your-name {
				font-size: 1.2rem;
			}

			.name-input {
				border-radius: 5px;
				padding: 5px 10px;
			}

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
		}
	}
`;

export default class HighScore extends Component {
	state = {
		highScore: false,
		name: '',
		scoreSubmitted: false,
		message: '',
	};

	nameInput = null;

	componentDidMount = () => {
		this.setState({ message: 'Checking high scores. Please wait...' }, () => {
			this.checkHighScore(this.props.points);
		});
	};

	checkHighScore = points => {
		return axios
			.get(`${ this.props.backendUrl }/top10/bottom`)
			.then(data => {
				if (points > data.data.score) {
					return this.setState({ highScore: true, message: '' }, () => this.nameInput.focus());
				}
				return this.setState({ message: 'You didn\'t make it into the Top 10 =(' });
			})
			.catch(e => console.log(e));
	}; // checkHighScore()

	postNewHighScore = highScore => {
		return this.setState({ message: 'Posting high score. Please wait...' }, () => {
			return axios
			.post(`${ this.props.backendUrl }/top10/`, highScore)
			.then(data => this.setState({ scoreSubmitted: true, message: '' }, () => this.props.getTopTen()))
			.catch(e => console.log(e));
		});
	}; // postNewHighScore()

	handleInputChange = e => {
		if (e.target.value.length < 32) {
			return this.setState({
				[e.target.name]: e.target.value,
				message: ''
			});
		}

		return this.setState({
			message: 'Name must be less than 32 characters.'
		});
	}

	handleSubmit = e => {
		e.preventDefault();
		const { name } = this.state;
		let emptyName = true;

		for (let i = 0; i < name.length; i++) {
			// if there exists a char in the name other than empty spaces, then emptyName is false.
			if (name[i] !== ' ') {
				emptyName = false;
				break;
			}
		}

		// if emptyName is true, return an error message stating such.
		if (emptyName) return this.setState({ message: 'Name must not be empty.' });

		// else, post the new high score.
		const newHighScore = { name, score: this.props.points };
		this.postNewHighScore(newHighScore);
	} // handleSubmit()

	render() {
		const {
			highScore,
			name,
			scoreSubmitted,
			message
		} = this.state;
		return(
			<StyledHighScore>
				{
					highScore && !scoreSubmitted
					?
					<div className = 'wrapper'>
						<p className = 'high-score'>You got a high score!!</p>
						<form onSubmit = { this.handleSubmit }>
							<p className = 'enter-your-name'>Enter your name to save your record in the Top 10:</p>
							<input 
								ref = { e => this.nameInput = e }
								className = 'name-input'
								name = 'name'
								placeholder = 'Enter your name...'
								value = { name }
								onChange = { this.handleInputChange }
							/>

							{ message && <p className = 'message'>{ message }</p> }

							<button type = 'submit'>Submit</button>
						</form>
					</div>
					:
					<div className = 'wrapper'>
						{ message && <p className = 'message'>{ message }</p> }
					</div>
				}
			</StyledHighScore>
		);
	}
};
