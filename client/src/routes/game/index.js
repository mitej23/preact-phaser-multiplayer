import {Component, h} from 'preact';
import { route } from 'preact-router';
import setup from './getBasicConfig.js';

import { supabase  }from "../../utils/ConnectDB";

class Game extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            npc: "0",
            gameStarted: false,
            roomId: "",
            loading: true
        }
    }

    async componentDidMount(){
        // if using authentication then get the user data from the context here
        // get data from localstorage params: {name, npc}
        const roomParam = this.props.room.split("-");
        const roomId = roomParam[0];
        const roomPass = roomParam[1];

        if(roomId === ""){
            route("/");
        }  

        this.setState({roomId});

        console.log("compononentDidMount");

        // check room
        const {data: roomData, error: roomError} = await supabase.from('rooms').select('*').eq('room_id', roomId);

        if(roomData.length === 0){
            alert("Room does not exist");
            return route("/");   
        }

        if(roomData[0].room_password !== roomPass){
            alert("Room password is incorrect");
            return route("/");
        }

        console.log("roomData: ", roomData);
        
        // check if user was already in this room

        // userId (uniquely generate in startGame()), roomId, npc, name  

        let userId = localStorage.getItem("userId");

        if(userId){
            console.log("userId present in localStorage");
            // check if user is in room
            const {data: userInRoom, error: userInRoomError} = await supabase.from('players').select('*').eq('player_id', userId);

            if(userInRoom.length > 0){
                console.log("user is already in room");

                if(userInRoom[0].room_id === roomId){
                    console.log("user was already in room");
                    // directly join the game at previous position 

                    //get previous position and npc and name from userInRoom[0] and send as params; ==> setup(params);
                    this.setState({
                        gameStarted: true,
                        loading: false
                    });

                    return setup(userInRoom,true);
                }
                
            }

            console.log("user is not in room");
        }else{
            console.log("empty local storage")
        }

        this.setState({
            loading: false
        });
    }    

    startGame = async (e) => {
        e.preventDefault();
        if(this.state.name === ""){
            alert("Please enter a name");
            return;
        }
        // create unique id for user and store it in localstorage
        let userId = "";

        if(!localStorage.getItem("userId")){
            console.log("new user Id created")
            userId = (Math.random() + 1).toString(36).substring(7);
            localStorage.setItem("userId", userId);
        }else{
            userId = localStorage.getItem("userId");
            console.log("previous userId: ", userId);
        }

        localStorage.setItem("roomId", this.state.roomId);

        // create user in room
        const {data: newUser, error: newUserError} = await supabase.from('players').insert({
            player_id: userId,
            room_id: this.state.roomId,
            name: this.state.name,
            x: 3,
            y: 3,
            facing_direction: "down",
            sprite: this.state.npc,
        });


        this.setState({gameStarted: true});

        return setup(newUser,false);
    }
    
    render(){
        const {name, npc, gameStarted, loading} = this.state;

        return (
            <>
                {
                    loading ? <h1>loading</h1> :(
                    gameStarted ? <div id="game"></div>
                   : (
                       <form onSubmit={this.startGame}>
                            <h3>Start Game</h3>
                            <p>Name: </p>
				            <input type="text" value={name} onChange={(e) => this.setState({name : e.target.value})}/>
				            <p>Walking Animation Mapping: </p>
				            <select name="character" value={npc} onChange={(e) => this.setState({npc : e.target.value})}>
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
                            <button type="submit">Start Game</button>
                       </form>
                   ))
                }
            </>
           
              

        )
    }
  
}

export default Game