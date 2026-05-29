import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../PageTemplate";

export default function FirstPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const showEmail = () => {
    setSavedEmail(email);
  };

  const handleLogin = () => {
    //we have to add code to check user name and password are not empty
    if (!username || !password) {
      alert("please input correct username and pass");
      return;
    }
    console.log("Username:", username);
    console.log("Password:", password);
    navigate("/second-page");

    // We can add login logic here later
  };

  return (
    <PageTemplate>
      <div className="div">
        <h2>This is the first react page</h2>

        <br />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid gray",
            width: "250px",
          }}
        />

        <button onClick={showEmail}>Show Email</button>

        <h3>Your email is: {savedEmail}</h3>

        <br />
        <hr />

        {/* Login Section */}
        <div>
          <h2>Login Page</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid gray",
              width: "250px",
              marginBottom: "10px",
            }}
          />

          <br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid gray",
              width: "250px",
              marginBottom: "10px",
            }}
          />

          <br />

          <button onClick={handleLogin}>Login</button>
        </div>

        <br />

        <button onClick={() => navigate("/")}>Home page</button>
      </div>
    </PageTemplate>
  );
}
