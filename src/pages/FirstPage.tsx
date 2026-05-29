import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTemplate from '../PageTemplate';


export default function FirstPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [savedEmail, setSavedEmail] = useState('');
  const [username , setUsername] = useState("");
   const [password, setPassword] = useState("");
   const showEmail =() =>{
    setSavedEmail(email);
   };

   const handleLogin =() =>{
    if (username ==="" || password===""){
      alert("Please insert correct usename or password ");
      return;
    }
    console.log("Username:" , username);
    console.log("Password", password);
    navigate("/second-page");
    //we can add more login logic here latter
   };

   return (
      <PageTemplate>
        <div className='div'>
          <h2>This is loging page</h2>
          <br/>
          {/*Email Input*/}
          <input
            type='email'
            placeholder='Enter your Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "10px",
              borderRadius : "8px",
              border: "1px solid gray",
              width : "250px"
            }}
          />
          <button onClick={showEmail}> Show Email</button>
          <h3>Your Email is {savedEmail}</h3>
          <br/>
          <hr/>

          {/*Login Input */}
          <div>
            <h2>Login to the shopping page</h2>
            <input
              type='text'
              placeholder='Username'
              value={username}
              autoComplete='off'
              onChange={(e)=> setUsername(e.target.value)}
              style={{
                 padding: "10px",
              borderRadius : "8px",
              border: "1px solid gray",
              width : "250px",
              marginBottom:"10px"
              }}
            />
            <br/>
            <input
              type='password'
              placeholder='Password'
              value={password}
              autoComplete='new-password'
              onChange={(e)=> setPassword(e.target.value)}
              style={{
                 padding: "10px",
              borderRadius : "8px",
              border: "1px solid gray",
              width : "250px",
              marginBottom:"10px"
              }}
              />
              <button onClick={handleLogin}>Login</button>
          </div>
<br/>
              <button onClick={()=> navigate("/")}>HomePage</button>
        </div>
      </PageTemplate>

   );
  }