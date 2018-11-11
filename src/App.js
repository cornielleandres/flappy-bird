import React, { Component } from 'react';

// Components
import { Header, Board } from './components/index.js';

class App extends Component {
	render() {
		return (
			<div className = 'App'>
				<Header />

				<Board />
			</div>
		);
	}
}

export default App;
