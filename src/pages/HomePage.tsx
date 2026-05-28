import { useNavigate } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import { useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    {
      id: 1,
      checked: true,
      item: "Item1",
    },
    {
      id: 2,
      checked: false,
      item: "Item2",
    },
    {
      id: 3,
      checked: false,
      item: "Item3",
    },
  ]);

  function handleOnClick() {
    navigate("/first-page");
  }
  const handlecheck = (id: any) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    );
    setItems(listItems);
    localStorage.setItem("shopinglist", JSON.stringify(listItems));
  };

  const handleDelete = (id: any) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
    localStorage.setItem("shopinglist", JSON.stringify(listItems));
  };

  return (
    <PageTemplate>
      <div className="div">
        <ul>
          {items.map((item) => (
            <li className="item" key={item.id}>
              <input
                type="checkbox"
                onChange={() => handlecheck(item.id)}
                checked={item.checked}
              />
              <label
                style={item.checked ? { textDecoration: "line-through" } : null}
                onDoubleClick={() => handlecheck(item.id)}
              >
                {item.item}
              </label>

              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
        This is the first react page
        <button onClick={handleOnClick}>First Page</button>
      </div>
    </PageTemplate>
  );
}
