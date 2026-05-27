import { useNavigate } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import { useState } from "react";


export default function HomePage() {
  const navigate = useNavigate();
  const [items , setItems] = useState([
{
  id: 1,
  checked: false,
  item:"Item1"
},
{
  id: 2,
  checked: false,
  item:"Item2"
},
{
  id: 3,
  checked: false,
  item:"Item3"
}

  ])
  function handleOnClick (){
    navigate("/first-page")
  }
  return (
    <PageTemplate>
    <div className="div">
      <ul>
        {items.map((item) => (
          <li className="item" key={item.id}>
            <input type="checkbox" 
                  checked={item.checked}
            /> 
            <label>{item.item}</label>
           
            <button>Delete</button>
          </li>
        ))}
      </ul>
      This is the first react page
      <button onClick={handleOnClick}>First Page</button>
    </div>
    </PageTemplate>
  )
}