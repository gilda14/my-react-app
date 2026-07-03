import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";

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
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Register as a buyer or seller</p>

        <div className={styles.form}>
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

          <select
            className={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">🛒 Buyer</option>
            <option value="seller">🏪 Seller</option>
          </select>

          <div className={styles.buttons}>
            <Button onClick={handleRegister}>Create Account</Button>

            <Button variant="secondary" onClick={handleOnClick}>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
