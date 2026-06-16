import PageTemplate from "../PageTemplate";
import { useNavigate } from "react-router-dom";
import SearchItem from "../components/SearchItem";
import { useState } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import Button from "../components/Button";

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
    {
      id: 1,
      name: "Apple",
      price: 2.99,
      picture: "/apple.png",
    },
    {
      id: 2,
      name: "Milk",
      price: 4.5,
      picture: "/milk.png",
    },
    {
      id: 3,
      name: "Bread",
      price: 3.25,
      picture: "/bread.png",
    },
  ]);

  function handleOnClick() {
    localStorage.removeItem("currentUser");
    navigate("/first-page");
  }

  async function handAddToList(product: Product) {
    if (!currentUser) {
      //alert("Please login first");
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
        return;
      }

      // alert("Item added to shopping list");
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
      <div className="div">
        <h3>All Products</h3>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaSearch />
          <SearchItem setSearch={setSearch} />
        </div>

        <Button onClick={handleGoToShoppingList}>
          <FaShoppingCart />
        </Button>

        <br />

        <Button onClick={handleOnClick} style={{ float: "right" }}>
          Log out
        </Button>

        <div>
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((product) => (
              <div className="item" key={product.id}>
                <img
                  src={product.picture}
                  alt={product.name}
                  style={{
                    width: "35px",
                    height: "35px",
                    marginLeft: "20px",
                    marginRight: "20px",
                  }}
                />

                <h4>{product.name}</h4>

                <p
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  ${product.price}
                </p>

                <Button onClick={() => handAddToList(product)}>
                  Add to the shopping list
                </Button>
              </div>
            ))}
        </div>
      </div>
    </PageTemplate>
  );
}
