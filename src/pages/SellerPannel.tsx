import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import Button from "../components/Button";
import Input from "../components/Input";
import styles from "./SellerPanel.module.css";

type Product = {
  id: number;
  name: string;
  description: string;
  photo: string;
  price: number;
  category: string;
  seller_id: number;
};

type SellerOrder = {
  order_id: number;
  status: string;
  created_at: string;
  order_item_id: number;
  product_name: string;
  price: string;
  picture: string;
  quantity: number;
  seller_id: number;
};

export default function SellerPanel() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Food");
  const [uploading, setUploading] = useState(false);

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [sellerOrders, setSellerOrders] = useState<SellerOrder[]>([]);
  const [balance, setBalance] = useState(0);
  const [statusChanges, setStatusChanges] = useState<Record<number, string>>(
    {},
  );

  async function getMyProducts() {
    if (!currentUser) return;

    const response = await fetch(
      `http://localhost:5000/seller/items/${currentUser.id}`,
    );

    const data = await response.json();
    setMyProducts(data);
  }

  async function getSellerOrders() {
    if (!currentUser) return;

    const response = await fetch(
      `http://localhost:5000/seller/orders/${currentUser.id}`,
    );

    const data = await response.json();
    setSellerOrders(data);
  }

  async function getSellerBalance() {
    if (!currentUser) return;

    const response = await fetch(
      `http://localhost:5000/seller/balance/${currentUser.id}`,
    );

    const data = await response.json();

    setBalance(Number(data.balance));
  }

  useEffect(() => {
    async function loadSellerData() {
      await getMyProducts();
      await getSellerOrders();
      await getSellerBalance();
    }

    loadSellerData();
  }, []);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setPhoto(data.imageUrl);
    setUploading(false);
  }

  async function handleAddProduct() {
    if (!name || !description || !photo || !price) {
      alert("Please complete all fields.");
      return;
    }

    const response = await fetch("http://localhost:5000/seller/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seller_id: currentUser.id,
        name,
        description,
        photo,
        price: Number(price),
        category,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Product added successfully!");
      setName("");
      setDescription("");
      setPhoto("");
      setPrice("");
      setCategory("Food");
      getMyProducts();
    } else {
      alert(data.message || "Failed to add product");
    }
  }

  async function handleUpdateOrderStatus(orderId: number, status: string) {
    const response = await fetch(
      `http://localhost:5000/seller/order-items/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );

    if (response.ok) {
      alert("Order status updated successfully!");
      setStatusChanges({});
      getSellerOrders();
    } else {
      alert("Failed to update order status");
    }
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/first-page");
  }

  return (
    <PageTemplate>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div>
              <h1>Seller Panel</h1>
              <p>Welcome, {currentUser?.username}</p>
              <p>Create and manage your products.</p>

              <h3>Balance: ${balance.toFixed(2)}</h3>
            </div>

            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={() => navigate("/first-page")}
              >
                Back to Login
              </Button>

              <Button variant="ghost" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>

          <div className={styles.form}>
            <Input placeholder="Product Name" value={name} onChange={setName} />

            <Input
              placeholder="Description"
              value={description}
              onChange={setDescription}
            />

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {uploading && <p>Uploading image...</p>}

            {photo && (
              <img
                src={photo}
                alt="Preview"
                style={{ width: "120px", borderRadius: "10px" }}
              />
            )}

            <Input placeholder="Price" value={price} onChange={setPrice} />

            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Food">Food</option>
              <option value="Meat & Seafood">Meat & Seafood</option>
              <option value="Pet Food & Pet Supplies">
                Pet Food & Pet Supplies
              </option>
              <option value="Household Cleaning Products">
                Household Cleaning Products
              </option>
              <option value="Laundry Products">Laundry Products</option>
            </select>

            <div className={styles.buttonBox}>
              <Button fullWidth onClick={handleAddProduct}>
                Add Product
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Customer Orders</h2>

          {sellerOrders.length === 0 ? (
            <p>No customers have bought your products yet.</p>
          ) : (
            sellerOrders.map((order) => (
              <div key={order.order_item_id} className={styles.productRow}>
                <img
                  src={order.picture}
                  alt={order.product_name}
                  className={styles.productImage}
                />

                <div>
                  <h3>{order.product_name}</h3>
                  <p>Order ID: #{order.order_id}</p>
                  <p>Qty: {order.quantity}</p>
                  <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>

                  <p>
                    Current Status: <strong>{order.status}</strong>
                  </p>

                  <select
                    className={styles.statusSelect}
                    value={statusChanges[order.order_item_id] || order.status}
                    disabled={order.status === "Delivered"}
                    onChange={(e) => {
                      setStatusChanges({
                        ...statusChanges,
                        [order.order_item_id]: e.target.value,
                      });
                    }}
                  >
                    <option value="Ordered">Ordered</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  {order.status !== "Delivered" && (
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleUpdateOrderStatus(
                          order.order_item_id,
                          statusChanges[order.order_item_id] || order.status,
                        )
                      }
                    >
                      Save Status
                    </Button>
                  )}
                </div>

                <strong>
                  ${(Number(order.price) * Number(order.quantity)).toFixed(2)}
                </strong>
              </div>
            ))
          )}
        </div>

        <div className={styles.card}>
          <h2>My Products</h2>

          {myProducts.length === 0 ? (
            <p>You have not added any products yet.</p>
          ) : (
            myProducts.map((product) => (
              <div key={product.id} className={styles.productRow}>
                <img
                  src={product.photo}
                  alt={product.name}
                  className={styles.productImage}
                />

                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>{product.category}</p>
                </div>

                <strong>${Number(product.price).toFixed(2)}</strong>
              </div>
            ))
          )}
        </div>
      </div>
    </PageTemplate>
  );
}
