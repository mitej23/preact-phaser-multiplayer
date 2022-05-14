import { Route, Router, Redirect, route } from 'preact-router';

import {h} from 'preact';
import {useState} from 'preact/hooks'

import Header from './header';

// auth context
import { AuthProvider, useAuth } from '../contexts/Auth';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';
import Game from '../routes/game';
import Signup from '../routes/auth/signup';
import Login from '../routes/auth/login';

const PrivateRoute = ({ Component, ...children }) => {
	  const { user } = useAuth();

	  console.log(user)

	  if(user){
		return <Component {...children} />	
	  }else{
		return route("/login")
	  }
}
		

const App = () => {
	return (
		<div id="app">
			<AuthProvider>
				<Router>
					<Home exact path="/" />
					{/* <Signup path="/signup/" />
					<Login path="/login/" /> */}
					<Game path="/game/:remaining_path*" />
					<Profile path="/profile/" user="me" />
				</Router>
			</AuthProvider>
		</div>
	)
	
}

export default App;
