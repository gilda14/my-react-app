import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import Button from "../components/Button";
import Input from "../components/Input";

export default function FirstPage() {
  const navigate = useNavigate();

  // const [email, setEmail] = useState("");
  // const [savedEmail, setSavedEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = async () => {
    if (username === "" || password === "") {
      alert("Please enter a username and password");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        alert("User registered successfully!");
        console.log(data);

        setUsername("");
        setPassword("");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      alert("Check browser console");
    }
  };

  const handleLogin = async () => {
    if (username === "" || password === "") {
      alert("Please insert correct username or password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        navigate("/second-page");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Check browser console");
    }
  };
  return (
    <PageTemplate>
      <div className="div">
        {/*Email Input*/}
        {/* <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid gray",
            width: "250px",
          }}
        />
        <button onClick={showEmail}> Show Email</button>
        <h3>Your Email is {savedEmail}</h3>
        <br />
        <hr /> */}
        <Button onClick={() => navigate("/")}>Home Page</Button>
        {/*Login Input */}
        <div>
          <h2>Login to the shopping page</h2>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            autoComplete="off"
            onChange={setUsername}
          />
          <br />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            onChange={setPassword}
          />
          <br />
          <Button onClick={handleLogin}>Login</Button>

          <br />
          <Button onClick={() => navigate("/register")}>Register</Button>
        </div>
      </div>
    </PageTemplate>
  );
}
