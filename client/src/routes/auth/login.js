import {h} from 'preact';
import {useState, useEffect} from 'preact/hooks'

import style from './style.css';

import { useAuth } from '../../contexts/Auth';
import { route } from 'preact-router';



const Login = () => {

  const {signIn, user} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async (e) => {
    e.preventDefault();
    console.log(email, password);
    if(email === '' || password === ''){
        alert("Please enter a email and password");
        return;
    }

    // login using supabase
    const {error} = await signIn({email, password});    

    if(error){
        alert("Login failed");
    }else{
        alert("Login success");
    }
  }

  if(user){
    route("/");
  }

  return (
      <div class={style.home}>
        <form onSubmit={loginUser}>
            <h1>Login</h1>
            <label for="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label for="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
      </div>
  )
}

export default Login