import PageTemplate from "../PageTemplate";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Button from "../components/Button";
import DecreaseButton from "../components/DecreaseButton";

type Product = {
  id: number;
  name: string;
  price: number;
  picture: string;
};

type ShoppingItem = {
  id: string;
  item: Product;
  quantity: number;
  userId: string;
};

export default function ShoppingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "{}",
  ) as { id: string; username: string };

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(
    location.state?.shoppingList || [],
  );

  function handleDeleteItem(id: string) {
    const updatedList = shoppingList.filter((item) => item.id !== id);

    setShoppingList(updatedList);
    localStorage.setItem(
      `shoppingList_${currentUser.id}`,
      JSON.stringify(updatedList),
    );
  }

  function handleDecreaseQuantity(id: string) {
    const updatedList = shoppingList.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(item.quantity - 1, 1),
          }
        : item,
    );

    setShoppingList(updatedList);
    localStorage.setItem("shoppingList", JSON.stringify(updatedList));
  }
  return (
    <PageTemplate>
      <div className="div">
        <h2>Shopping List Page</h2>

        {shoppingList.length === 0 ? (
          <p>No items in shopping list</p>
        ) : (
          shoppingList.map((item) => (
            <div className="item" key={item.id}>
              <img
                src={item.item.picture}
                alt={item.item.name}
                style={{
                  width: "35px",
                  height: "35px",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
              />
              <h4>{item.item.name}</h4>

              <p style={{ paddingLeft: "10px" }}> ${item.item.price}</p>

              <p style={{ paddingLeft: "50px" }}>{item.quantity}</p>

              <DecreaseButton
                value={item.quantity}
                min={1}
                onChange={() => handleDecreaseQuantity(item.id)}
              />

              <button
                onClick={() => handleDeleteItem(item.id)}
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  border: "none",
                }}
              >
                <FaTrashAlt style={{ color: "black", fontSize: "10px" }} />
              </button>
            </div>
          ))
        )}

        <Button onClick={() => navigate("/second-page")}>Back</Button>
      </div>
    </PageTemplate>
  );
}
