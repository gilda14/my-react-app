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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const totalPrice = shoppingList.reduce((total, item) => {
    if (selectedItems.includes(item.id)) {
      return total + Number(item.price) * Number(item.quantity);
    }

    return total;
  }, 0);

  useEffect(() => {
    async function getShoppingList() {
      if (!currentUser) return;

      try {
        const response = await fetch(
          `http://localhost:5000/shopping-list/${currentUser.id}`,
        );

        const data = await response.json();
        setShoppingList(data);
      } catch (error) {
        console.error("Error loading shopping list:", error);
      }
    }

    getShoppingList();
  }, []);

  function handleCheckboxChange(id: number) {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id],
    );
  }

  async function handleDeleteItem(id: number) {
    await fetch(`http://localhost:5000/shopping-list/${id}`, {
      method: "DELETE",
    });

    setShoppingList((prevShoppingList) =>
      prevShoppingList.filter((item) => item.id !== id),
    );

    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((itemId) => itemId !== id),
    );
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

    setShoppingList((prevShoppingList) =>
      prevShoppingList.map((shoppingItem) =>
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

    setShoppingList((prevShoppingList) =>
      prevShoppingList.map((shoppingItem) =>
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

            <Button variant="secondary" onClick={() => navigate("/my-orders")}>
              My Orders
            </Button>

            <Button variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>

        {!currentUser ? (
          <div className={styles.emptyCard}>
            <p>Please log in first</p>
          </div>
        ) : shoppingList.length === 0 ? (
          <div className={styles.emptyCard}>
            <p>No items in shopping list</p>
          </div>
        ) : (
          <div className={styles.cartBox}>
            {shoppingList.map((item) => (
              <div className={styles.item} key={item.id}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                  className={styles.checkbox}
                />

                <div className={styles.imageBox}>
                  <img
                    src={item.picture}
                    alt={item.product_name}
                    className={styles.image}
                  />
                </div>

                <div className={styles.productInfo}>
                  <h4>{item.product_name}</h4>
                  <p>Price: ${Number(item.price).toFixed(2)}</p>
                </div>

                <div className={styles.quantityBox}>
                  <span>Qty: {item.quantity}</span>

                  <DecreaseButton
                    value={item.quantity}
                    min={1}
                    onChange={() => handleDecreaseQuantity(item)}
                  />

                  <IncreaseButton
                    onChange={() => handleIncreaseQuantity(item)}
                  />
                </div>

                <div className={styles.itemTotal}>
                  ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </div>

                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.summary}>
          <h3>
            Total Price is: <strong>${totalPrice.toFixed(2)}</strong>
          </h3>

          <Button
            variant="primary"
            onClick={() => {
              const itemsForPayment = shoppingList.filter((item) =>
                selectedItems.includes(item.id),
              );

              navigate("/payment", {
                state: {
                  items: itemsForPayment,
                  totalPrice: totalPrice,
                },
              });
            }}
          >
            Proceed to payment
          </Button>
        </div>
      </div>
    </PageTemplate>
  );
}
