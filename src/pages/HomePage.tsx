import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  function handleOnClick (){
    navigate("/first-page")
  }
  return (
    <div className="div">
      This is the first react page
      <button onClick={handleOnClick}>First Page</button>
    </div>
  )
}