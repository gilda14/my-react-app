import { useNavigate } from "react-router-dom";
import PageTemplate from "../PageTemplate";

export default function HomePage() {
  const navigate = useNavigate();
  function handleOnClick() {
    navigate("/first-page");
  }

  return (
    <PageTemplate>
      <div className="div">
        <h3>Shopping list </h3>
        This is the first react page
        <button onClick={handleOnClick}>First Page</button>
      </div>
    </PageTemplate>
  );
}
