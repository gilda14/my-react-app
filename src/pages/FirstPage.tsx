import { useState } from 'react'

import { useNavigate } from 'react-router-dom';

export default function FirstPage() {

const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [savedEmail, setSavedEmail] = useState('')

  const showEmail = () => {
    setSavedEmail(email)
  }

  return (
    <div className="div">
      This is the first react page

      <br />

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid gray',
          width: '250px'
        }}
      />

      <button onClick={showEmail}>
        Show Email
      </button>

      <h3>Your email is : {savedEmail}</h3>

      <button onClick={()=> navigate("/")}>
        Home page 
      </button>
    </div>
  )
}