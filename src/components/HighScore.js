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

			.enter-your-name, .error-msg {
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
		errorMsg: '',
	};

	componentDidMount = () => this.checkHighScore(this.props.points);

	checkHighScore = points => {
		return axios
			.get(`${ this.props.backendUrl }/top10/bottom`)
			.then(data => points > data.data.score && this.setState({ highScore: true, errorMsg: '' }))
			.catch(e => console.log(e));
	}; // checkHighScore()

	postNewHighScore = highScore => {
		return axios
			.post(`${ this.props.backendUrl }/top10/`, highScore)
			.then(data => this.setState({ scoreSubmitted: true, errorMsg: '' }, () => this.props.getTopTen()))
			.catch(e => console.log(e));
	}; // postNewHighScore()

	handleInputChange = e => {
		if (e.target.value.length < 32) {
			return this.setState({
				[e.target.name]: e.target.value,
				errorMsg: ''
			});
		}

		return this.setState({
			errorMsg: 'Name must be less than 32 characters.'
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
		if (emptyName) return this.setState({ errorMsg: 'Name must not be empty.' });

		// else, post the new high score.
		const newHighScore = { name, score: this.props.points };
		this.postNewHighScore(newHighScore);
	} // handleSubmit()

	render() {
		const {
			highScore,
			name,
			scoreSubmitted,
			errorMsg
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
								className = 'name-input'
								name = 'name'
								placeholder = 'Enter your name...'
								value = { name }
								onChange = { this.handleInputChange }
							/>

							{ errorMsg && <p className = 'error-msg'>{ errorMsg }</p> }

							<button type = 'submit'>Submit</button>
						</form>
					</div>
					:
					null
				}
			</StyledHighScore>
		);
	}
};
