import {Component, h} from 'preact';
import setup from './getBasicConfig.js';

class Game extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        // get data from localstorage params: {name, npc}
        const params = JSON.parse(localStorage.getItem("params"));
        setup(params);
    }    
    
    render(){
        return (
            <>
              <div id="game"></div>
              {/* <script src="./phaser.min.js"></script> */}
              {/* <script src="./GridEngine.min.js"></script> */}
              {/* <script src="./GameScene.js"></script>  */}
              {/* <script src="./getBasicConfig.js"></script> */}
            </>
        )
    }
  
}

export default Game