import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
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
    console.log(data);
    alert(data.message);
  }

  function handleOnClick() {
    navigate("/first-page");
  }

  return (
    <div>
      <h2>Register User</h2>

      <Input
        type="text"
        placeholder="Username"
        value={username}
        autoComplete="off"
        onChange={setUsername}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        autoComplete="new-password"
        onChange={setPassword}
      />

      {/* <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /> */}

      {/* <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /> */}

      <Button onClick={handleRegister}>Submit</Button>
      <Button onClick={handleOnClick}>back to login page</Button>
    </div>
  );
}
