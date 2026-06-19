import PageTemplate from "../PageTemplate";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Button from "../components/Button";
import DecreaseButton from "../components/DecreaseButton";
import IncreaseButton from "../components/IncreaseButton";
import styles from "./ShoppingPage.module.css";

type ShoppingItem = {
  id: number;
  user_id: number;
  product_name: string;
  price: number;
  picture: string;
  quantity: number;
};

export default function ShoppingPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  const totalPrice = shoppingList.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  useEffect(() => {
    async function getShoppingList() {
      if (!currentUser) return;

      const response = await fetch(
        `http://localhost:5000/shopping-list/${currentUser.id}`,
      );

      const data = await response.json();
      setShoppingList(data);
    }

    getShoppingList();
  }, []);

  async function handleDeleteItem(id: number) {
    await fetch(`http://localhost:5000/shopping-list/${id}`, {
      method: "DELETE",
    });

    setShoppingList(shoppingList.filter((item) => item.id !== id));
  }

  async function handleDecreaseQuantity(item: ShoppingItem) {
    const newQuantity = Math.max(item.quantity - 1, 1);

    await fetch(`http://localhost:5000/shopping-list/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    setShoppingList(
      shoppingList.map((shoppingItem) =>
        shoppingItem.id === item.id
          ? { ...shoppingItem, quantity: newQuantity }
          : shoppingItem,
      ),
    );
  }

  async function handleIncreaseQuantity(item: ShoppingItem) {
    const newQuantity = item.quantity + 1;

    await fetch(`http://localhost:5000/shopping-list/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    setShoppingList(
      shoppingList.map((shoppingItem) =>
        shoppingItem.id === item.id
          ? { ...shoppingItem, quantity: newQuantity }
          : shoppingItem,
      ),
    );
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/first-page");
  }

  return (
    <PageTemplate>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h2>Shopping List Page</h2>
            <p>Manage your shopping items</p>
          </div>

          <div className={styles.actions}>
            <Button
              variant="secondary"
              onClick={() => navigate("/second-page")}
            >
              Back to products
            </Button>

            <Button variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>

        {!currentUser ? (
          <p>Please log in first</p>
        ) : shoppingList.length === 0 ? (
          <p>No items in shopping list</p>
        ) : (
          shoppingList.map((item) => (
            <div className="item" key={item.id}>
              <img
                src={item.picture}
                alt={item.product_name}
                style={{
                  width: "35px",
                  height: "35px",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
              />

              <h4>{item.product_name}</h4>

              <p style={{ paddingLeft: "10px" }}>${item.price}</p>

              <p style={{ paddingLeft: "50px" }}>{item.quantity}</p>

              <DecreaseButton
                value={item.quantity}
                min={1}
                onChange={() => handleDecreaseQuantity(item)}
              />

              <IncreaseButton onChange={() => handleIncreaseQuantity(item)} />

              <div style={{ marginRight: "15px" }}>
                <h4>
                  Price of this item is:{" "}
                  {(item.price * item.quantity).toFixed(2)}
                </h4>
              </div>

              <button onClick={() => handleDeleteItem(item.id)}>
                <FaTrashAlt />
              </button>
            </div>
          ))
        )}

        <div style={{ float: "left" }}>
          <h3>Total Price is : ${totalPrice.toFixed(2)}</h3>
        </div>
      </div>
    </PageTemplate>
  );
}
