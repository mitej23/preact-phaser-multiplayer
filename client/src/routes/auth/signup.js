import {h} from 'preact';
import {useState, useEffect} from 'preact/hooks'

import style from './style.css';

import { useAuth } from '../../contexts/Auth';
import { login } from '../../utils/ConnectDB';

const Signup = () => {  
  const {signUp, user} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUpUser = async (e) => {
    e.preventDefault();
    console.log(email, password);
    if(email === '' || password === ''){
        alert("Please enter a email and password");
        return;
    }

    // signup using supabase
    const { error } = await signUp({ email, password })

    if (error) {
      alert('error signing in')
    } else {
      // Redirect user to Dashboard
      console.log('signed up')
    }
  }

  if(user){
    route("/");
  }

  return (
      <div class={style.home}>
        <form onSubmit={signUpUser}>
            <h1>Signup</h1>
            <label for="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label for="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Signup</button>
        </form>
      </div>
  )
}

export default Signup