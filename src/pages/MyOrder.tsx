import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import Button from "../components/Button";
import styles from "./MyOrder.module.css";

type OrderItem = {
  order_id: number;
  total_price: number;
  created_at: string;
  order_item_id: number;
  product_name: string;
  price: number;
  picture: string;
  quantity: number;
};

export default function MyOrderPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function getOrders() {
      if (!currentUser) return;

      const response = await fetch(
        `http://localhost:5000/orders/${currentUser.id}`,
      );

      const data = await response.json();
      console.log("ORDERS DATA:", data);
      setOrders(data);
    }

    getOrders();
  }, []);

  return (
    <PageTemplate>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1>My Orders</h1>
            <p>Here are the items you have purchased.</p>
          </div>

          <Button
            variant="secondary"
            onClick={() => navigate("/shopping-page")}
          >
            Back to Shopping
          </Button>
        </div>

        {!currentUser ? (
          <div className={styles.card}>
            <p>Please log in first.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.card}>
            <p>You do not have any orders yet.</p>
          </div>
        ) : (
          <div className={styles.ordersBox}>
            {orders.map((item) => (
              <div className={styles.orderItem} key={item.order_item_id}>
                <img
                  src={item.picture || "/no-image.png"}
                  alt={item.product_name}
                  className={styles.image}
                />

                <div className={styles.info}>
                  <h3>{item.product_name}</h3>
                  <p>Order ID: #{item.order_id}</p>
                  <p>Date: {new Date(item.created_at).toLocaleDateString()}</p>
                </div>

                <div className={styles.details}>
                  <p>Qty: {item.quantity}</p>
                  <strong>
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTemplate>
  );
}
