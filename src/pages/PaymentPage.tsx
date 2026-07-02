import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import PageTemplate from "../PageTemplate";
import styles from "./PaymentPage.module.css";

type ShoppingItem = {
  id: number;
  user_id: number;
  product_name: string;
  price: number;
  photo: string;
  picture?: string;
  quantity: number;
  seller_id: number;
};

type PaymentState = {
  items: ShoppingItem[];
  totalPrice: number;
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const paymentData = location.state as PaymentState | null;

  const items = paymentData?.items || [];
  const totalPrice = paymentData?.totalPrice || 0;

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);

  /* Fake form for bank */

  async function handleFakePayment() {
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      alert("Please fill all payment fields");
      return;
    }

    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );

    if (!currentUser) {
      alert("Please log in first");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          items: items,
          total_price: totalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      setPaymentDone(true);
    } catch (error) {
      console.error("PAYMENT ERROR:", error);
      alert("Payment failed. Please try again.");
    }
  }

  /*
      Later we will do backend here:
      1. Send paid items to new database table
      2. Delete paid items from shopping-list table
    */

  if (items.length === 0) {
    return (
      <PageTemplate>
        <div className={styles.page}>
          <div className={styles.card}>
            <h1>No items selected</h1>
            <p>Please go back and choose items for payment.</p>

            <Button
              variant="primary"
              onClick={() => navigate("/shopping-page")}
            >
              Back to Shopping List
            </Button>
          </div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className={styles.page}>
        <div className={styles.paymentBox}>
          <div className={styles.leftSide}>
            <h1>Payment Page</h1>
            <p>Complete your fake payment for selected items.</p>

            <div className={styles.itemsBox}>
              {items.map((item) => (
                <div className={styles.item} key={item.id}>
                  <img
                    src={item.photo}
                    alt={item.product_name}
                    className={styles.image}
                  />

                  <div>
                    <h3>{item.product_name}</h3>
                    <p>Qty: {item.quantity}</p>
                    <p>
                      Price: $
                      {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totalBox}>
              <span>Total Payment:</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
          </div>

          <div className={styles.rightSide}>
            {paymentDone ? (
              <div className={styles.successBox}>
                <h2>Payment Successful!</h2>
                <p>Your fake payment has been completed.</p>

                <Button
                  variant="primary"
                  onClick={() => navigate("/shopping-page")}
                >
                  Back to Shopping List
                </Button>
              </div>
            ) : (
              <>
                <h2>Fake Card Payment</h2>

                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />

                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />

                <div className={styles.row}>
                  <div>
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>

                <Button variant="primary" onClick={handleFakePayment}>
                  Pay ${totalPrice.toFixed(2)}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => navigate("/shopping-page")}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
