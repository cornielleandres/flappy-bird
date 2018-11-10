import React, { Component } from 'react';

// Components
import { Board } from './components/index.js';

class App extends Component {
	render() {
		return (
			<div className = 'App'>
				<header className = 'App-header'>
					Flappy Bird Clone
				</header>

				<Board />
			</div>
		);
	}
}

export default App;
