import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import Button from "../components/Button";

export default function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((result) => {
        setData(JSON.stringify(result));
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  }, []);

  function handleOnClick() {
    navigate("/first-page");
  }

  return (
    <PageTemplate>
      <div className="div">
        <h3>Shopping list</h3>

        <p>This is the first react page</p>

        <p>Database connected successfully ✅</p>

        <Button onClick={handleOnClick}>First Page</Button>
      </div>
    </PageTemplate>
  );
}
