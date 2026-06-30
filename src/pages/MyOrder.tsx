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
  status: string;
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

  function isStepComplete(currentStatus: string, step: string) {
    const steps = [
      "Ordered",
      "Preparing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];

    return steps.indexOf(currentStatus) >= steps.indexOf(step);
  }

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
                <div className={styles.orderTop}>
                  <img
                    src={item.picture || "/no-image.png"}
                    alt={item.product_name}
                    className={styles.image}
                  />

                  <div className={styles.info}>
                    <h3>{item.product_name}</h3>
                    <p>Order ID: #{item.order_id}</p>
                    <p>
                      Date: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {item.status}
                    </p>
                  </div>

                  <div className={styles.details}>
                    <p>Qty: {item.quantity}</p>
                    <strong>
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className={styles.tracking}>
                  <h4>📦 Order Tracking</h4>

                  <div className={styles.trackingContainer}>
                    <div className={styles.step}>
                      <div
                        className={
                          isStepComplete(item.status, "Ordered")
                            ? styles.activeCircle
                            : styles.circle
                        }
                      >
                        {isStepComplete(item.status, "Ordered") ? "✓" : ""}
                      </div>
                      <span>Ordered</span>
                    </div>

                    <div
                      className={
                        isStepComplete(item.status, "Preparing")
                          ? styles.activeLine
                          : styles.line
                      }
                    ></div>

                    <div className={styles.step}>
                      <div
                        className={
                          isStepComplete(item.status, "Preparing")
                            ? styles.activeCircle
                            : styles.circle
                        }
                      >
                        {isStepComplete(item.status, "Preparing") ? "✓" : ""}
                      </div>
                      <span>Preparing</span>
                    </div>

                    <div
                      className={
                        isStepComplete(item.status, "Shipped")
                          ? styles.activeLine
                          : styles.line
                      }
                    ></div>

                    <div className={styles.step}>
                      <div
                        className={
                          isStepComplete(item.status, "Shipped")
                            ? styles.activeCircle
                            : styles.circle
                        }
                      >
                        {isStepComplete(item.status, "Shipped") ? "✓" : ""}
                      </div>
                      <span>Shipped</span>
                    </div>

                    <div
                      className={
                        isStepComplete(item.status, "Out for Delivery")
                          ? styles.activeLine
                          : styles.line
                      }
                    ></div>

                    <div className={styles.step}>
                      <div
                        className={
                          isStepComplete(item.status, "Out for Delivery")
                            ? styles.activeCircle
                            : styles.circle
                        }
                      >
                        {isStepComplete(item.status, "Out for Delivery")
                          ? "✓"
                          : ""}
                      </div>
                      <span>Out for Delivery</span>
                    </div>

                    <div
                      className={
                        isStepComplete(item.status, "Delivered")
                          ? styles.activeLine
                          : styles.line
                      }
                    ></div>

                    <div className={styles.step}>
                      <div
                        className={
                          isStepComplete(item.status, "Delivered")
                            ? styles.activeCircle
                            : styles.circle
                        }
                      >
                        {isStepComplete(item.status, "Delivered") ? "✓" : ""}
                      </div>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTemplate>
  );
}
