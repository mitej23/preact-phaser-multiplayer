import style from './style.css';

import { h} from 'preact';
import {useState} from 'preact/hooks'
import { Link } from 'preact-router/match';
import { route } from 'preact-router';
import { supabase  }from "../../utils/ConnectDB";

const Home = () => {
	const [joinGame, setJoinGame] = useState(false);
	const [loading, setLoading] = useState(false);

	const [name , setName] = useState("");

	const [roomId , setRoomId] = useState("");
	const [roomPass, setRoomPass] = useState("");
	
	const handleSubmit = async(e) => {
		e.preventDefault();

		setLoading(true);

		// pass email id -> user.email

		// Create room
		// -- check if room exists

		const {data: roomData, error: roomError} = await supabase.from('rooms').select('*').eq('room_id', roomId);

		if(joinGame){
			route('/game?room=' + roomId + "-" + roomPass);
		} else{
			if(roomData.length > 0){
				setLoading(false);
				return alert("Room already exists, please enter another room id");
			}else{
				const {data: createdRoom, error: createdRoomError} = await supabase.from('rooms').insert({
						room_id: roomId,
						room_password: roomPass,
					});
				
				if(createdRoomError){
					return alert("Error creating room");
				}	
	
				setLoading(false);
	
				route("/game?room=" + roomId + "-" + roomPass);
	
			}
		}

	}
	return (
		<div class={style.home}>
			<h1>Start Game</h1>
			<form onSubmit={handleSubmit}>
				{
					joinGame === false ? (
						<>
							<h3>Create a room</h3>
							<p>Room Id</p>
							<input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)}/>
							<p>Room Password</p>
							<input type="text" value={roomPass} onChange={(e) => setRoomPass(e.target.value)}/>
							<p>Join a game? <span style="text-decoration:underline" onClick={() => setJoinGame(true)}>click</span></p>
						</>
					): (
						<>
						<h3>Join a room</h3>
							<p>Room ID</p>
							<input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)}/>
							<p>Room Password</p>
							<input type="text" value={roomPass} onChange={(e) => setRoomPass(e.target.value)}/>
							<p>Want to create a new game? <span style="text-decoration:underline" onClick={() => setJoinGame(false)}>click</span></p>
						</>
						
					)
				}
				<button type="submit">{
					loading ? "Loading..." : (
						joinGame === false ? "Create Game" : "Join Game"
					)
					
				}</button>
			</form>
			
			
			{/* <Link activeClassName={style.active} href={`/game?params=${name}-${walkingAnimationMapping}`}>Game</Link> */}
		</div>
	)

	
};

export default Home;
