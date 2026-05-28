import { useNavigate } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import { useState } from "react";

type Item = {
  id: number;
  checked: boolean;
  item: string;
};

export default function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([
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
  const [newItem, setNewItem] = useState("");

  function handleOnClick() {
    navigate("/first-page");
  }
  const handlecheck = (id: number) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    );
    setItems(listItems);
    localStorage.setItem("shopinglist", JSON.stringify(listItems));
  };

  const handleDelete = (id: number) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
    localStorage.setItem("shopinglist", JSON.stringify(listItems));
  };

  const handleAddItem = () => {
    if (newItem.trim() === "") return;
    const newListItem: Item = {
      id: items.length ? items[items.length - 1].id + 1 : 1,
      checked: false,
      item: newItem,
    };
    const listItems = [...items, newListItem];
    setItems(listItems);
    localStorage.setItem("shopinglist", JSON.stringify(listItems));
    setNewItem("");
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
          <li>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <button onClick={handleAddItem}>Add More Item </button>
          </li>
        </ul>
        This is the first react page
        <button onClick={handleOnClick}>First Page</button>
      </div>
    </PageTemplate>
  );
}
