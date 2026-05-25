import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTemplate from '../PageTemplate';


export default function FirstPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [savedEmail, setSavedEmail] = useState('');
  const showEmail = () => {
    setSavedEmail(email);
  };

  const [name, setName] = useState('Dave');

  const handleNameChange = () => {
    const names = ['Bob', 'Kavin', 'David'];
    const int = Math.floor(Math.random() * 3);
   setName (names[int]);
  };

  const handleClick = () => {
    console.log('you click it')
  };

   const handleClick2 = (name) => {
    console.log(`${name} was clicked`)
  };

   const handleClick3 = (e) => {
    console.log(e.target.innerText)
  };

  return (
    <PageTemplate>
      <div className="div">
        <h2>This is the first react page</h2>

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
            width: '250px',
          }}
        />

        <button onClick={showEmail}>
          Show Email
        </button>

        <h3>Your email is: {savedEmail}</h3>

          <p onDoubleClick={handleClick}>
            Hello {name}!
          </p>

        <button onClick={handleNameChange}>change name </button>
        <button onClick={() => handleClick2('Dave')}>Click on me2</button>
         <button onClick={(e) => handleClick3(e)}>Click on me3</button>
        <br/>
        <button onClick={() => navigate('/')}>
          Home page
        </button>
      </div>
    </PageTemplate>
  );
}