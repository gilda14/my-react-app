import PageTemplate from "../PageTemplate";
import { useNavigate } from "react-router-dom";
import SearchItem from "../components/SearchItem";
import { useState } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import Button from "../components/Button";
import styles from "../components/SecondPage.module.css";

type Product = {
  id: number;
  name: string;
  price: number;
  picture: string;
};

export default function Secondpage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const [search, setSearch] = useState("");

  const [products] = useState<Product[]>([
    { id: 1, name: "Apple", price: 2.99, picture: "/apple.png" },
    { id: 2, name: "Milk", price: 4.5, picture: "/milk.png" },
    { id: 3, name: "Bread", price: 3.25, picture: "/bread.png" },
  ]);

  function handleOnClick() {
    localStorage.removeItem("currentUser");
    navigate("/first-page");
  }

  async function handAddToList(product: Product) {
    if (!currentUser) {
      navigate("/first-page");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          product,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add item");
      }
    } catch (error) {
      console.error(error);
      alert("Could not connect to server");
    }
  }

  function handleGoToShoppingList() {
    navigate("/shopping-Page");
  }

  return (
    <PageTemplate>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h2>All Products</h2>
            <p>Choose items for your shopping list</p>
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={handleGoToShoppingList}>
              <FaShoppingCart />
            </Button>

            <Button variant="ghost" onClick={handleOnClick}>
              Log out
            </Button>
          </div>
        </div>

        <div className={styles.searchBox}>
          <FaSearch />
          <SearchItem setSearch={setSearch} />
        </div>

        <div className={styles.productGrid}>
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((product) => (
              <div className={styles.card} key={product.id}>
                <img
                  src={product.picture}
                  alt={product.name}
                  className={styles.productImage}
                />

                <h3>{product.name}</h3>

                <p className={styles.price}>${product.price}</p>

                <Button fullWidth onClick={() => handAddToList(product)}>
                  Add to list
                </Button>
              </div>
            ))}
        </div>
      </div>
    </PageTemplate>
  );
}
