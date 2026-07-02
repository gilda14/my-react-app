import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const navigate = useNavigate();

  async function handleRegister() {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });

      const data = await response.json();

      alert(data.message);

      // Redirect to first page if registration succeeded
      if (response.ok) {
        navigate("/first-page");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    }
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

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="seller"> Seller</option>
      </select>
      <br />
      <Button onClick={handleRegister}>Submit</Button>

      <Button onClick={handleOnClick}>Back to Login Page</Button>
    </div>
  );
}
