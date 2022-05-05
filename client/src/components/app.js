import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';
import Game from '../routes/game';

const App = () => (
	<div id="app">
		<Header />
		<Router>
			<Home path="/" />
			<Game path="/game/:remaining_path*" />
			<Profile path="/profile/" user="me" />

		</Router>
	</div>
)

export default App;
