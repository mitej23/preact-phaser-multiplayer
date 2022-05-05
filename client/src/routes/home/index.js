import style from './style.css';

import { h} from 'preact';
import {useState} from 'preact/hooks'
import { Link } from 'preact-router/match';
import { route } from 'preact-router';

const Home = () => {

	// const name = "mitej";
	// const walkingAnimationMapping = 6;
	const [name , setName] = useState("");
	const [npc , setNpc] = useState("0");

	const handleSubmit = (e) => {
		e.preventDefault();


		if(name === ""){
			alert("Please enter a name");
			return;
		} 
		
		localStorage.setItem("params", JSON.stringify({name, npc}));

		route(`/game`);
	}


	return (
		<div class={style.home}>
			<h1>Start Game</h1>
			<form onSubmit={handleSubmit}>
				<p>Name: </p>
				<input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
				<p>Walking Animation Mapping: </p>
				<select name="character" value={npc} onChange={(e) => setNpc(e.target.value)}>
				  <option value="0">Dr. Strange</option>
				  <option value="1">Girl</option>
				  <option value="2">Psysic Girl</option>
				  <option value="3">Forest Girl</option>
				  <option value="4">Ash</option>
				  <option value="5">Sandman</option>
				  <option value="6">Fire Boy</option>
				  <option value="7">Water Girl</option>
				</select>
				<br />
				<br />
				<button type="submit">Submit</button>
			</form>
			
			
			{/* <Link activeClassName={style.active} href={`/game?params=${name}-${walkingAnimationMapping}`}>Game</Link> */}
		</div>
	)

	
};

export default Home;
