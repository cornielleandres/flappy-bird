import React, { Component } from 'react';

// Components
import { Header, Board } from './components/index.js';

export default class App extends Component {
	render() {
		return (
			<div className = 'App'>
				<Header />

				<Board />
			</div>
		);
	}
};
